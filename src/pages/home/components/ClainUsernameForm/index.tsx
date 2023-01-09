import { Button, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from './styles'

const claimUsernameFormSchema = z.object({
  username: z.string(),
})

// convertendo estrutura do zod (object, username e string) para uma estrutura do typeScript;
// inferir (definir de forma automática) o tipo dos dados dentro do form.
type ClainUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export function ClainUsernameForm() {
  const { register, handleSubmit } = useForm<ClainUsernameFormData>()

  async function handleClaimUsername(data: ClainUsernameFormData) {
    console.log(data.username)
  }

  return (
    <Form as="form" onSubmit={handleSubmit(handleClaimUsername)}>
      <TextInput
        size="sm"
        prefix="ignite.com/"
        placeholder="seu-usuario"
        {...register('username')}
      />
      <Button size="sm" type="submit">
        Reservar
        <ArrowRight />
      </Button>
    </Form>
  )
}
