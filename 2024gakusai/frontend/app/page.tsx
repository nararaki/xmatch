'use client'
import NextLink from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  Box,
  useDisclosure,
} from '@/common/design'
import { login } from '@/lib/firebase/apis/auth'

// フォームで使用する変数の型を定義
type formInputs = {
  email: string
  password: string
}

/** サインイン画面
 * @screenname SignInScreen
 * @description ユーザのログインを行う画面
 */
export default function SignInScreen() {
  const { handleSubmit, register } = useForm<formInputs>();
  const router = useRouter();
  const disclosure = useDisclosure();
  const [show, setShow] = useState<boolean>(false);
  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    let result;
    try{
      result = await login(data);
      disclosure.onOpen();
    } catch(error) {
      console.log(error);
    } finally {
      console.log(result);
    }
  })
  return (

    <Box
      border="2px solid"
      borderColor="blue.500" // 枠線の色を指定
      borderRadius="md" // 枠線の角を丸める
      p={4} // 内側の余白
      bg="skyblue" // 背景色を指定
      maxW="300px" // 最大幅を指定
      mx="auto" // 中央揃え
    >
      <Flex
        flexDirection='column'
        width='100%'
        height='100vh'
        justifyContent='center'
        alignItems='center'
      >
        <VStack spacing='5'>
          <Heading color="black">ログイン</Heading>
          <form onSubmit={onSubmit}>
            <VStack spacing='4' alignItems='left'>
              <FormControl>
                <FormLabel htmlFor='email' textAlign='start' color={'black'}>
                  メールアドレス
                </FormLabel>
                <Input id='email' {...register('email')} />
              </FormControl>

              <FormControl>
                <FormLabel htmlFor='password' color={'black'}>パスワード</FormLabel>
                <InputGroup size='md'>
                  <Input
                    pr='4.5rem'
                    type={show ? 'text' : 'password'}
                    {...register('password')}
                  />
                  <InputRightElement width='4.5rem'>
                    <Button h='1.75rem' size='sm' onClick={() => setShow(!show)}>
                      {show ? 'Hide' : 'Show'}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                marginTop='4'
                color='white'
                bg='black'
                type='submit'
                paddingX='auto'
              >
                ログイン
              </Button>
              <Button
                as={NextLink}
                bg='white'
                color='black'
                href='/signup'
                width='100%'
              >
                新規登録はこちらから
              </Button>
            </VStack>
          </form>
          
        </VStack>
      </Flex>
    </Box>
  )
}
