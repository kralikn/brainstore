'use server'

import { createAndEditTopicSchema, fileSchema } from "./schemas"
import { createClient } from "./supabase/server"
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import PdfParse from 'pdf-parse/lib/pdf-parse'
import OpenAI from 'openai'
import * as XLSX from 'xlsx'
// import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';

// pdfjsLib.GlobalWorkerOptions.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.mjs';
// await import('pdfjs-dist/build/pdf.worker.min.mjs');
// import { encodingForModel } from "js-tiktoken";

// pdfjsLib.GlobalWorkerOptions.workerSrc = '//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js';

import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import axios from "axios"
import https from 'https'


const openAIApiKey = process.env.OPEN_AI_KEY
const openai = new OpenAI({
  apiKey: openAIApiKey
})

export async function socialAuth() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      // redirectTo: `https://nav-gov-docs.vercel.app/auth/callback`,
      redirectTo: `${process.env.BASIC_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    },
  })
  if (data.url) {
    redirect(data.url) // use the redirect API for your server framework
  }
}
export async function signOut() {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()
  redirect('/')
}
export async function createTopic(values) {
  const { topic_title } = values
  const supabase = await createClient()
  const folder_name = topic_title.normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .toLowerCase();

  try {
    createAndEditTopicSchema.parse(values)

    const { error } = await supabase
      .from('topics')
      .insert({ title: topic_title, folder_name })

    if (error) {
      console.log(error)
      return null
    }

    return { message: "A témakör létrehozva!" }

  } catch (error) {
    console.error(error)
    return null;
  }
}
export async function deleteTopic(topic) {

  const { id } = topic
  try {
    const supabase = await createClient()
    const { data: seletedData, error: selectedError } = await supabase
      .from('documents')
      .select('id, doc_path')
      .eq('topic_id', id)

    if (seletedData.length > 0) {
      const idArray = seletedData.map(item => item.id)
      const pathArray = seletedData.map(path => path.doc_path)
      const { error } = await supabase
        .from('document_sections')
        .delete()
        .eq('topic_id', id)

      const response = await supabase
        .from('documents')
        .delete()
        .in('id', idArray)

      const { data: deletedDocs, error: deletedError } = await supabase
        .storage
        .from('brainstore')
        .remove(pathArray)
    }

    const { data: deletedNotes, error: deletedNotesError } = await supabase
      .from('notes')
      .delete()
      .eq('topic_id', id)

    console.log(id);

    if (deletedNotesError) {
      console.log("deletedNotesError: ", deletedNotesError)
      return null
    }

    const { error } = await supabase
      .from('topics')
      .delete()
      .eq('id', id)

    if (error) {
      console.log(error)
      return null
    }

    return { message: "A témakör törölve!" }

  } catch (error) {
    console.error(error)
    return null;
  }
}
export async function getAllTopics() {


  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('topics')
      .select()

    if (error) {
      console.log(error)
      return null
    }

    let { data: groupByData, error: groupByError } = await supabase
      .rpc('count_documents_and_notes_by_topic')


    if (groupByError) {
      console.log(groupByError)
      return null
    }
    const mergedData = data.map(row => {
      const matchingData = groupByData.find(g_row => g_row.topic_id === row.id);
      if (matchingData) {
        return { ...row, doc_count: matchingData.doc_count, has_doc_embedded: matchingData.has_doc_embedded, note_count: matchingData.note_count, has_note_embedded: matchingData.has_note_embedded }
      } else {
        return row
      }
    })

    return mergedData
  } catch (error) {
    console.log(error)
    return null
  }
}
export async function getFiles(topicSlug) {

  // await new Promise(resolve => setTimeout(resolve, 8000))

  try {
    const supabase = await createClient()

    const { data: topicData, error: topicError } = await supabase
      .from('topics')
      .select()
      .eq('folder_name', topicSlug)

    if (topicError) {
      console.log(topicError)
      return null
    }

    const topic_id = topicData[0].id

    const { data, error } = await supabase
      .from('documents')
      .select()
      .eq('topic_id', topic_id)

    if (error) {
      console.log(error)
      return null
    }

    const docsWithSignedUrl = await Promise.all(
      data.map(async (item) => {
        const { signedUrl } = await getSignedUrl(item.doc_path)
        item.signedUrl = signedUrl
        return item
      })
    )

    return { docs: docsWithSignedUrl, topicTitle: topicData[0].title }
  } catch (error) {
    console.log(error)
    return null
  }
}
export async function uploadFile(data) {

  const { formData, topicSlug } = data

  const file = formData.get('topic_file')
  const result = fileSchema.safeParse({ file })

  const pdfData = await file.arrayBuffer()
  const docContent = await PdfParse(pdfData)

  if (!result.success) {
    const errors = result.error.errors.map((error) => error.message);
    throw new Error(errors.join(','));
  }

  const fileName = `${uuidv4()}.pdf`

  try {
    const supabase = await createClient()
    const { data: uploadedFile, error } = await supabase.storage
      .from('brainstore')
      .upload(`${topicSlug}/${fileName}`, result.data.file)

    if (error) {
      console.log(error)
      return null
    }

    const { data: selectData, error: selectError } = await supabase
      .from('topics')
      .select()
      .eq('folder_name', topicSlug)

    const newDocument = {
      doc_path: uploadedFile.path,
      doc_original_name: file.name,
      topic_id: selectData[0].id
    }

    const { data: insertData, error: insertError } = await supabase
      .from('documents')
      .insert(newDocument)
      .select()

    if (insertError) {
      console.log(insertError)
      return null
    }

    return { message: "A fájl sikeresen feltöltve!" }

  } catch (error) {
    console.log(error)
    return null
  }
}
export async function deleteDocument(doc) {

  const { id, doc_path } = doc
  try {
    const supabase = await createClient()

    const { error: deletedSectionsError } = await supabase
      .from('document_sections')
      .delete()
      .eq('doc_id', id)

    if (deletedSectionsError) {
      console.log(deletedDocError)
      return null
    }

    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)

    if (error) {
      console.log(error)
      return null
    }

    const { error: deletedDocError } = await supabase
      .storage
      .from('brainstore')
      .remove([doc_path])

    if (deletedDocError) {
      console.log(deletedDocError)
      return null
    }


    return { message: "A fájl törölve!" }

  } catch (error) {
    console.error(error)
    return null;
  }
}
export async function getSignedUrl(docPath) {

  const supabase = await createClient()
  const { data, error } = await supabase.storage
    .from('brainstore')
    .createSignedUrl(`${docPath}`, 60)
  if (error) {
    console.log(error)
    return null

  }
  return data
}
export async function createEmbeddings(doc) {

  const { id, doc_path, topic_id } = doc

  const supabase = await createClient()
  const { data, error } = await supabase.storage
    .from('brainstore')
    .download(doc_path)

  const pdfData = await data.arrayBuffer()
  const docContent = await PdfParse(pdfData)

  const cleanPageBreaks = docContent.text
    .replace(/^\d+\s*\n/gm, '')             // hivatkozási számok eltávolítása
  // .replace(/\n\n \n/g, '\n \n')
  // .replace(/\d+\n/g, '')
  // .replace(/\.+/g, '')
  // .replace(//g, '-')
  // .replace(/•/g, '-')

  const chaptersArray = cleanPageBreaks.split(' \n \n \n \n')

  const cleanedChaptersArray = []
  chaptersArray.forEach(chapter => {
    if (chapter.length !== 0) cleanedChaptersArray.push(chapter.replace(/\s+/g, ' ').trim())
  })
  // console.log(chaptersArray.length);
  // console.log(cleanedChaptersArray.length);

  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: cleanedChaptersArray,
    encoding_format: "float",
  })

  const documentSections = embedding.data.map((item, index) => {
    return { content: cleanedChaptersArray[index], embedding: item.embedding, doc_id: id, topic_id }
  })

  const { error: insertedError } = await supabase
    .from('document_sections')
    .insert(documentSections)

  if (insertedError) {
    console.log("multiple embeds insert error: ", insertedError)
    return null
  }

  const { data: updatedDoc, error: updatedError } = await supabase
    .from('documents')
    .update({ embedded: true })
    .eq('id', id)

  return { message: "A dokumentum feldolgozva" }

}
export async function getSouerceForChat(topicId) {
  // console.log("topicId on server: ", topicId);
  try {
    const supabase = await createClient()
    const { count, data: documentsData, error: documentsError } = await supabase
      .from('documents')
      .select('*', { count: 'exact' })
      .eq('topic_id', topicId)
      .eq('embedded', true)

    if (documentsError) {
      console.log(documentsError)
      return null
    }
    const { count: notesCount, data: notesData, error: notesError } = await supabase
      .from('notes')
      .select('*', { count: 'exact' })
      .eq('topic_id', topicId)
      .eq('embedded', true)

    if (notesError) {
      console.log(notesError)
      return null
    }

    const { data: topicData, error: topicError } = await supabase
      .from('topics')
      .select()
      .eq('id', topicId)

    if (topicError) {
      console.log(topicError)
      return null
    }

    const docsWithSignedUrl = await Promise.all(
      documentsData.map(async (item) => {
        const { signedUrl } = await getSignedUrl(item.doc_path)
        item.signedUrl = signedUrl
        return item
      })
    )

    return { docsCount: count, notesCount: notesCount, topicTitle: topicData[0].title, docs: docsWithSignedUrl, notes: notesData }

  } catch (error) {
    console.log(error)
    return null
  }

}
export async function generateChatResponse({ prevMessages, query, topicId }) {

  // await new Promise(resolve => setTimeout(resolve, 10000))

  try {

    const supabase = await createClient()

    // 1. standalone question
    let queryEmbedding
    try {
      const queryEmbeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input: query.content,
        encoding_format: "float",
      })
      queryEmbedding = queryEmbeddingResponse.data[0].embedding

    } catch (error) {
      console.error("Hiba az embedding létrehozása közben:", error);
      return { message: "Hiba történt az embedding létrehozása során." };
    }

    let context = ''
    try {
      let { data, error } = await supabase
        .rpc('match_documents_by_topic_id', {
          match_count: 3,
          p_topic_id: topicId,
          query_embedding: queryEmbedding
        })

      if (error) {
        console.error("Hiba az RPC hívás során:", error);
        return { message: "Hiba történt a dokumentumok lekérése során." };
      }

      data.map((item, index) => {
        if (index + 1 === data.length) {
          context += `${item.content.trim()}`
        } else {
          context += `${item.content.trim()}\n\n---\n\n`
        }
      })
    } catch (error) {
      console.error("Hiba a dokumentum lekérdezése során:", error);
      return { message: "Hiba történt a dokumentumok adatbázisból való lekérése során." };
    }

    const prompt = `Felhasználó aktuális kérdése/kérése: "${query.content}"
    Kontextus:
    ${context}`

    const systemContent = `Te egy mesterséges intelligenciával működő asszisztens vagy, amely segít a felhasználónak kérdéseket megválaszolni a megadott dokumentumrészletek és a korábbi beszélgetés alapján.
                          Csak az itt megadott és a korábbi üzenetekben található információkat használd a pontos válasz megfogalmazásához.
                          Ha a megadott információkból nem tudsz egyértelmű választ adni, kérlek, válaszolj a következő sablon szerint:
                          "Sajnálom, de a rendelkezésre álló információk alapján erre a kérdésre jelenleg nem tudok válaszolni."`

    let messagesForPrompt = []
    if (prevMessages.length < 1) {
      messagesForPrompt = [{ role: "system", content: systemContent }, { role: "user", content: prompt }]
    } else {
      // messagesForPrompt = [{ role: "system", content: systemContent }, { role: "user", content: prompt }]
      messagesForPrompt = [{ role: "system", content: systemContent }, ...prevMessages, { role: "user", content: prompt }]
    }

    // const enc = encodingForModel("gpt-4o-mini")
    // console.log(enc.encode(prompt).length);
    // console.log(enc.encode(systemContent).length);
    console.log(prompt);
    try {
      const completion = await openai.chat.completions.create({
        messages: messagesForPrompt,
        model: "gpt-4o-mini",
        // model: "gpt-4o-2024-11-20",
        // max_completion_tokens: 1500,
        temperature: 0
      })
      const { prompt_tokens, completion_tokens, total_tokens } = completion.usage
      const { role, content } = completion.choices[0].message

      return { message: { role, content }, tokens: { prompt_tokens, completion_tokens, total_tokens } }

    } catch (error) {
      console.error("Hiba a chat completion során:", error);
      return { message: "Hiba történt a válasz generálása során." };
    }
  } catch (error) {
    console.error("Általános hiba:", error);
    return { message: "Általános hiba történt a függvény futtatása közben." };
  }
}
export async function createContext({ editorJSON, noteTitle, topicSlug }) {

  let noteContent = ''
  const title = noteTitle
  const noteJSON = editorJSON
  // console.log(data);
  // console.log(JSON.parse(data).root.children);
  const rows = JSON.parse(noteJSON).root.children
  // console.log(JSON.parse(data).root.children[0]);
  rows.map(rowObject => {
    console.log(rowObject);
    if (rowObject.children.length !== 0) {
      const text = rowObject.children[0].text
      noteContent = noteContent + '\n' + text
    } else {
      noteContent = noteContent + '\n'
    }
  })

  const supabase = await createClient()
  const { data: topicData, error: topicError } = await supabase
    .from('topics')
    .select()
    .eq('folder_name', topicSlug)

  if (topicError) {
    console.log(topicError)
    return null
  }

  const topic_id = topicData[0].id

  const { error } = await supabase
    .from('notes')
    .insert({ topic_id, content: noteContent, editor_json: noteJSON, title })

  if (error) {
    console.log(error)
    return null
  }

  return null
}
// export async function extractBankTransactions(data) {

//   const { formData } = data

//   const file = formData.get('bank_statement')
//   const result = fileSchema.safeParse({ file })
//   if (!result.success) {
//     const errors = result.error.errors.map((error) => error.message);
//     throw new Error(errors.join(','));
//   }
//   const pdfData = await file.arrayBuffer()
//   // const docContent = await PdfParse(pdfData)


//   const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise

//   const extractedTexts = []
//   const pageCount = pdfDoc.numPages

//   for (let i = 0; i < pageCount; i++) {
//     const page = await pdfDoc.getPage(i + 1)
//     // console.log(page);
//     const textContent = await page.getTextContent()
//     textContent.items.map(item => {
//       extractedTexts.push(item.str)
//     })
//   }

//   const startIndex = extractedTexts.findIndex(text => text.startsWith("Kivonat száma:"))
//   // const startIndex = extractedTexts.indexOf("Kivonat száma:")
//   // const endIndex = extractedTexts.indexOf("Összesen:")
//   const endIndex = extractedTexts.indexOf("Összesen:")

//   const transactionsArr = extractedTexts.slice(startIndex, endIndex)
//   const statementString = transactionsArr.join('\n')
//   // console.log(transactionsArr);

//   // for (let i = 0; i < firstPageText.length; i++) {

//   // }

//   // const docContentArray = docContent.text.split('\n')
//   // const cleanedDocContent = docContentArray.map(row => {
//   //   return row.replace(/(\d)\s+(\d)/g, '$1$2')
//   //   // .replace(/(\d)\s+\./g, '$1.')
//   //   // .replace(/([a-zA-Z])\s+(\d)/g, '$1 $2')
//   // }).join('\n')

//   // "statement_data": {
//   //   "account": "HU93 1030 0002 1333 9078 0001 4908",
//   //   "currency": "HUF",
//   //   "statement_number": "2024/075",
//   //   "opening_balance": 21410283,
//   //   "closing_balance": 27022350
//   // },
//   // 4. Ne használj kódblokkokat(\`\`\`), csak tiszta JSON-t adj vissza.


//   const systemContent = `Te egy mesterséges intelligenciával működő asszisztens vagy, amely segít bankszámlakivonatokból a tranzakciós adatokat kinyerni és azokat strukturált formában megadni.`;

//   const prompt = `Kérlek, gyűjtsd ki a bankszámlakivonaton szereplő összes tranzakció részleteit az alábbi mezők szerint:
//     - Értéknap (pl. "2024.09.05")
//     - Tranzakció típusa ("terhelés", "jóváírás")
//     - Tranzakció megnevezése
//     - Partner neve
//     - Partner bankszámlaszáma
//     - Megjegyzés
//     - Összeg

//     Az eredményt strukturált JSON formátumban add vissza az alábbi minta szerint:
//       {
//         "statement_data": {
//           "account": "HU93 1030 0002 1333 9078 0001 4908",
//           "currency": "HUF",
//           "statement_number": "2024/075",
//           "opening_balance": 21410283,
//           "closing_balance": 27022350
//         },
//         "transactions":[
//           {
//             "datum": "2024.09.05",
//             "tipus": "terhelés",
//             "megnevezes": "Betétlekötés",
//             "partner": "FAKÉP BT",
//             "partner_bankszamlaszama": "HU07117050082042865900000000",
//             "megjegyzes": "Lekötés időtartalma: 20240828 - 20240904",
//             "jogcim": "szla. kiegy.",
//             "osszeg": 130510
//           },
//           {
//             "datum": "2024.09.05",
//             "tipus": "jóváírás",
//             "megnevezes": "Toke elszámolása",
//             "partner": "GEO-LOG KÖRNYEZETVÉD. ÉS GEOFIZ.KFT",
//             "partner_bankszamlaszama": "HU73117140062024733900000000",
//             "megjegyzes": "E-TRIUM-2024-203 szla",
//             "jogcim": "bankköltség",
//             "osszeg": 327919
//           },
//           {
//             "datum": "2024.09.05",
//             "tipus": "jóváírás",
//             "megnevezes": "Toke elszámolása",
//             "partner": "GEO-LOG KÖRNYEZETVÉD. ÉS GEOFIZ.KFT",
//             "partner_bankszamlaszama": "HU73117140062024733900000000",
//             "megjegyzes": "E-TRIUM-2024-203 szla",
//             "jogcim": "betét",
//             "osszeg": 327919
//           }
//         ]
//       }

//     Fontos megjegyzések:
//     1. Ha egy tranzakcióhoz tartozó adat hiányzik, az adott mezőt hagyd üresen ("").
//     2. Az eredmény tartalmazza a bankszámlakivonat összes tranzakcióját a bankszámlakivonaton szereplő sorrendben.
//     3. Az adatokat pontosan a megadott mezőnevekkel és formátumban add meg.
//     4. Ne használj kódblokkokat(\`\`\`), csak tiszta JSON-t adj vissza.
//     5. Ha a megnevezés "könyvelési díj" vagy szerepel benne, hogy "jutaléka", akkor a jogcím legyen "bankköltség"
//     6. Ha a megnevezés "tőke elszámolás", "kamat elszámolás" vagy "betétlekötés", akkor a jogcím legyen "betét".
//     7. Ha a megnevezés "tőke elszámolás", akkor az egy jóváírás és a megjegyzés legyen üres "tőke elszámolás".
//     8. Ha a megnevezés "betét lekötés", akkor a megjegyzés legyen üres "betét lekötés".
//     9. Ha a megnevezés "kamat elszámolás", akkor a megjegyzés legyen üres "kamat elszámolás".
//     10. Ha a megnevezés tartalmazza, hogy "átutalás jóváírása", akkor a jogcím legyen "szla. kiegy.".

//     A bankszámlakivonat szöveges tartalma a következő:

//     ${statementString}
//   `

//   const messagesForPrompt = [{ role: "system", content: systemContent }, { role: "user", content: prompt }]

//   const completion = await openai.chat.completions.create({
//     messages: messagesForPrompt,
//     model: "gpt-4o-mini",
//     // model: "chatgpt-4o-latest",
//     // max_completion_tokens: 1500,
//     temperature: 0
//   })

//   // console.log(completion.choices[0].message)
//   // // // console.log(completion.choices[0].message.content)

//   // // // const content = JSON.parse(completion.choices[0].message.content)
//   const rawContent = completion.choices[0].message.content.trim()
//   const cleanContent = rawContent.replace(/```json|```/g, ''); // Kódblokkok eltávolítása
//   const content = JSON.parse(cleanContent);
//   const transactionsArray = content.transactions

//   const statement_data = content.statement_data
//   const transactions = transactionsArray.map(transaction => {
//     return { ...transaction, id: uuidv4(), statement_number: statement_data.statement_number }
//   })
//   // // const transactions = content.map(transaction => {
//   // //   return { ...transaction, id: uuidv4() }
//   // // })

//   return { statement_data, transactions }

//   // return transactions

//   // return null

// }
// export async function getFileFromWeb({ formData }) {

//   // const file = formData.get('bank_statement')
//   // const pdfData = await file.arrayBuffer()
//   // const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise
//   // const pageCount = pdfDoc.numPages
//   // console.log(pageCount)

//   // const agent = new https.Agent({
//   //   rejectUnauthorized: false
//   // })
//   // console.log("on sever")
//   // const url = 'https://nav.gov.hu/pfile/file?path=/ugyfeliranytu/nezzen-utana/inf_fuz/informacios-fuzetek---2024/18.-informacios-fuzet---A-szamla-nyugta-kibocsatasanak-alapveto-szabalyai'
//   // const { data } = await axios.get(url, { responseType: 'arraybuffer', httpsAgent: agent })
//   // const pdfData = new Uint8Array(data);
//   // const pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise
//   // const pageCount = pdfDoc.numPages
//   // console.log(pageCount)

//   // const page = await pdfDoc.getPage(4)
//   // const textContent = await page.getTextContent()

//   // const extractedTexts = []
//   // textContent.items.map(item => {
//   //   // console.log(item)
//   //   extractedTexts.push(item.str)
//   // })

//   // // // console.log(extractedTexts)
//   // // const doc = await PdfParse(data)
//   // // console.log(doc);

//   // return extractedTexts
// }



