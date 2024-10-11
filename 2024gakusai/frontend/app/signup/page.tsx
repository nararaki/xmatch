'use client'
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
    Modal,
    ModalOverlay,
    ModalHeader,
    ModalContent,
    ModalCloseButton,
    ModalFooter,
    ModalBody,
    useDisclosure,
  } from '@/common/design'
import { signUpWithEmail } from '@/lib/firebase/apis/auth'
import { useState } from 'react'
import { FormStatusNotPending } from 'react-dom'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
type formInputs = {
    email:string
    password:string
}
export default function signUpScreen(){
    const router = useRouter();
    const {handleSubmit,register} = useForm<formInputs>();
    const [show,setShow] = useState<boolean>(false);
    const disclosure = useDisclosure();
    const [nickname,setnickname] = useState<string>();
    const onSubmit = handleSubmit(async(args:formInputs)=>{
        let result;
        try{
            result = await signUpWithEmail(args);
        }catch(error){
            console.log(error);
        }
        if(result){
          disclosure.onOpen();
        }
    });
    const HandleNickname = (event:React.ChangeEvent<HTMLInputElement>)=>{
      setnickname(event.target.value);
    }
    function CloseModal(){
      router.push(`${nickname}/select`);
    }
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
          <Heading color="black"></Heading>
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
                この内容で新規登録
              </Button>
            </VStack>
          </form>
          <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
            <ModalOverlay bg="rgba(0, 0, 0, 0.6)"/>
            <ModalContent maxW="400px" mx="auto" bg = "skyblue">
              <ModalCloseButton 
              position={"absolute"}
              right={"10px"}
              />
              <ModalBody>
              
                  <div>ニックネームを決めよう</div>
                  <Input placeholder="ニックネームを入力" value={nickname} mt={4} onChange={HandleNickname}/>
                
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="red" onClick={CloseModal} color={"green"}>
                  利用を始める
                </Button>
              </ModalFooter>
            </ModalContent> 
          </Modal>
        </VStack>
      </Flex>
    </Box>
    )
}
