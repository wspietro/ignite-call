import { Button, Text, TextInput } from '@ignite-ui/react'
import { ArrowRight } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Form, FormAnnotation } from './styles'

const claimUsernameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'usuário deve conter ao menos 3 letras' })
    .regex(/^([a-z\\-]+)$/i, { message: 'somente letras e hifens' })
    .transform((username) => username.toLowerCase()),
})

// convertendo estrutura do zod (object, username e string) para uma estrutura do typeScript;
// inferir (definir de forma automática) o tipo dos dados dentro do form.
type ClainUsernameFormData = z.infer<typeof claimUsernameFormSchema>

export function ClainUsernameForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClainUsernameFormData>({
    resolver: zodResolver(claimUsernameFormSchema),
  })

  async function handleClaimUsername(data: ClainUsernameFormData) {
    console.log(data)
  }

  return (
    <>
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

      <FormAnnotation>
        <Text size="sm">
          {errors.username
            ? errors.username.message
            : 'Digite o nome do usuário desejado.'}
        </Text>
      </FormAnnotation>
    </>
  )
}
