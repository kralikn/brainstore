import ChatFileList from "./chat-file-list";
import ChatWindow from "./chat-window";

export default function ChatContainer({ topicId }) {
  return (
    <div className='grid grid-cols-6 min-h-[calc(100vh-16rem)] gap-4'>
      <div className='col-span-4'>
        <ChatWindow topicId={topicId} />
      </div>
      <div className='col-span-2 h-full'>
        <ChatFileList topicId={topicId} />
      </div>
    </div>

  )
}