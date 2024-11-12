'use client'

import { LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { signOut } from '@/utils/actions';


export default function SignOutButton() {
  return (
    <Button size='sm' onClick={signOut}>
      <LogOut /> Kilépés
    </Button>
  )
}
