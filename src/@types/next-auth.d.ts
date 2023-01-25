// reescrever tipagens de bibliotecas
import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    name: string
    email: string
    username: string
    avatar_url: string
  } // ao declarar interfaces, não estamos subistituindo, interface por padrão tem comportamento de extensão

  interface Session {
    user: User
  }
}
