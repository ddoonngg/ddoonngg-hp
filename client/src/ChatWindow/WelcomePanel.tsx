import { Box, Heading, VStack, Text } from '@chakra-ui/react';
import { RiRobot2Line } from 'react-icons/ri';

export default function WelcomePanel() {
  return (
    <VStack justify={'space-evenly'} w='100%'>
      <Box mt={'5%'}>
        <RiRobot2Line size={'2.5rem'} />
      </Box>
      <Heading mt={6} as='h2' size='md' textAlign={'center'}>
        Welcome to AI Profile Me
      </Heading>
      <Text>Please type your message below</Text>
      <VStack mt={8}>
        <HintButton text='Who are you?' />
      </VStack>
    </VStack>
  );
}

function HintButton({ text }: { text: string }) {
  return (
    <Box
      as='button'
      _hover={{ borderColor: 'gray.400' }}
      p={4}
      m={2}
      borderRadius={'xl'}
      border={'1px solid'}
      borderColor={'gray.300'}
    >
      <Text>{text}</Text>
    </Box>
  );
}
