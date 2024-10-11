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
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
} from '@/common/design'
import { login } from '@/lib/firebase/apis/auth'
import { isDOMComponent } from 'react-dom/test-utils'

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
  const onSubmit = () => {
    let result;
    disclosure.onOpen();
    console.log(disclosure.isOpen)
  }
  return (

    <div>
        <Button onClick={onSubmit}>click</Button>
          <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
            <ModalOverlay />
            <ModalContent>
                <Box
                border="2px solid"
                borderColor="blue.500" // 枠線の色を指定
                borderRadius="md" // 枠線の角を丸める
                p={4} // 内側の余白
                bg="skyblue" // 背景色を指定
                maxW="300px" // 最大幅を指定
                mx="auto">
              <ModalHeader>Define Name</ModalHeader>
              <ModalCloseButton />
              <ModalFooter>
                <p>ニックネームを決めよう</p>
                <Input textColor={"black"} placeholder='名前を入力'></Input>
                <Button colorScheme="red" onClick={disclosure.onClose}>
                  退会する
                </Button>
              </ModalFooter>
              </Box>
           </ModalContent>
          </Modal>
      </div>
  )
}
