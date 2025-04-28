import { Button, Field, Fieldset, Flex, Heading, HStack, Input, Link, Text } from "@chakra-ui/react";

export default function LoginPage() {
  return (
    <Flex width={"full"} height={"full"} overflow={"hidden"} justify={"center"} align={"center"}>
      <Fieldset.Root maxWidth={"80%"} width={96}>
        <Fieldset.Legend>
          <Heading>Login</Heading>
        </Fieldset.Legend>

        <Field.Root invalid={false}>
          <Field.Label>Email</Field.Label>
          {/*Todo: valid email*/}
          <Input placeholder={"me@example.com"} />
        </Field.Root>

        <Field.Root invalid={false}>
          <Field.Label>Password</Field.Label>
          <Input type={"password"} placeholder={"********"} />
        </Field.Root>

        <Button>Login</Button>

        <HStack>
          <Text color={"fg.subtle"}>Don&#39;t have an account?</Text>
          <Link href={"/register"}>
            <Text color={"fg"}>Register</Text>
          </Link>
        </HStack>
      </Fieldset.Root>
    </Flex>
  );
}
