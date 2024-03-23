import { HStack, WrapItem, Text, VStack, Heading } from '@chakra-ui/react';
import { Message } from '../models/message';
import { RiRobot2Line } from 'react-icons/ri';
import { FaRegUser } from 'react-icons/fa';

export default function MessageItem({ message }: { message: Message }) {
  const { from, data } = message;
  return (
    <HStack mb={4} alignItems={'flex-start'}>
      <WrapItem mr={2}>{from === 'User' ? <FaRegUser size={'1.5rem'} /> : <RiRobot2Line size={'1.5rem'} />}</WrapItem>
      <VStack alignItems={'flex-start'}>
        <Heading fontSize={'medium'}>{from === 'User' ? 'You' : 'Assistant'}</Heading>
        <Text mb={4}>{data}</Text>
      </VStack>
    </HStack>
  );
}
