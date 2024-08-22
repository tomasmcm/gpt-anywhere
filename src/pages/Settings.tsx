import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  HStack,
  Input,
  Link,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { DEFAULT_MAX_TOKENS, DEFAULT_TIMEOUT, STORE_KEY, DEFAULT_OPENAI_BASE_URL } from "../util/consts";
import store from "../util/store";

function Settings() {
  const toast = useToast();
  const [openAiKey, setOpenAiKey] = useState<string | null>(null);
  const [openAiBaseUrl, setOpenAiBaseUrl] = useState<string | null>(null);
  const [anthropicKey, setAnthropicKey] = useState<string | null>(null);
  const [timeout, setTimeout] = useState<number | null>(null);
  const [maxTokens, setMaxTokens] = useState<number | null>(null);

  useEffect(() => {
    const populateFields = async () => {
      const openAiKey: string | null = await store.get(
        STORE_KEY.OPENAI_API_KEY
      );
      const openAiBaseUrl: string | null = await store.get(
        STORE_KEY.OPENAI_BASE_URL
      );
      const anthropicKey: string | null = await store.get(
        STORE_KEY.ANTHROPIC_API_KEY
      );
      const timeout: number | null = await store.get(STORE_KEY.TIMEOUT);
      const maxTokens: number | null = await store.get(STORE_KEY.MAX_TOKENS);

      setOpenAiKey(openAiKey);
      setOpenAiBaseUrl(openAiBaseUrl);
      setAnthropicKey(anthropicKey);
      setTimeout(timeout ?? DEFAULT_TIMEOUT);
      setMaxTokens(maxTokens ?? DEFAULT_MAX_TOKENS);
    };

    populateFields();
  }, []);

  const handleSave = async () => {
    await store.set(STORE_KEY.OPENAI_API_KEY, openAiKey);
    await store.set(STORE_KEY.OPENAI_BASE_URL, openAiBaseUrl);
    await store.set(STORE_KEY.ANTHROPIC_API_KEY, anthropicKey);
    await store.set(STORE_KEY.TIMEOUT, timeout ?? DEFAULT_TIMEOUT);
    await store.set(STORE_KEY.MAX_TOKENS, maxTokens ?? DEFAULT_MAX_TOKENS);
    await store.save();

    toast({
      title: "Saved",
      description: "Your settings have been saved.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <VStack
      height="100vh"
      overflowY="auto"
      spacing={4}
      align="stretch"
      p={4}
    >
      <Heading size="md" color="whiteAlpha.600" fontWeight="normal">
        GPT Anywhere
      </Heading>
      <Heading>Settings</Heading>

      <Stack mt={4} spacing={4}>
        <FormControl>
          <FormLabel>OpenAI API Key</FormLabel>
          <Input
            type="password"
            placeholder="sk-..."
            value={openAiKey || ""}
            onChange={(e) => setOpenAiKey(e.target.value)}
            isRequired
          />
          <FormHelperText>
            You can generate an API key on{" "}
            <Link
              href="https://platform.openai.com/account/api-keys"
              isExternal
              color="blue.400"
            >
              OpenAI's website
            </Link>
          </FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>OpenAI Base URL</FormLabel>
          <Input
            type="text"
            placeholder="https://api.openai.com"
            value={openAiBaseUrl || DEFAULT_OPENAI_BASE_URL}
            onChange={(e) => setOpenAiBaseUrl(e.target.value)}
            isRequired
          />
          <FormHelperText>
            Base URL for OpenAI API. Note it should NOT end with "/"
          </FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel>Anthropic API Key</FormLabel>
          <Input
            type="password"
            placeholder="sk-..."
            value={anthropicKey || ""}
            onChange={(e) => setAnthropicKey(e.target.value)}
          />

          <FormHelperText>
            You can generate an API key on{" "}
            <Link
              href="https://console.anthropic.com/settings/keys"
              isExternal
              color="blue.400"
            >
              Anthropic's website
            </Link>
          </FormHelperText>
        </FormControl>

        {/*
        <FormControl>
          <FormLabel>Timeout</FormLabel>
          <FormHelperText>
            The maximum time (in seconds) to wait for a response from the OpenAI
            API.
          </FormHelperText>
          <HStack spacing={4}>
            <Slider
              aria-label="response-timeout"
              value={timeout ?? 0}
              onChange={(value) => setTimeout(value)}
              max={120}
              step={1}
              focusThumbOnChange={false}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>

            <NumberInput
              w={32}
              value={timeout ?? 0}
              onChange={(value) => {
                const num = Number(value);
                if (Number.isNaN(num)) return;
                setTimeout(num);
              }}
              max={120}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </HStack>
        </FormControl>
        */}

        <FormControl>
          <FormLabel>Max Tokens</FormLabel>
          <FormHelperText>
            The maximum number of tokens to return in a response.
          </FormHelperText>
          <HStack spacing={4}>
            <Slider
              aria-label="max-tokens"
              value={maxTokens ?? 0}
              onChange={(value) => setMaxTokens(value)}
              max={4096}
              step={100}
              focusThumbOnChange={false}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>

            <NumberInput
              w={32}
              value={maxTokens ?? 0}
              onChange={(value) => {
                const num = Number(value);
                if (Number.isNaN(num)) return;
                setMaxTokens(num);
              }}
              max={2048}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </HStack>
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          alignSelf="flex-end"
          onClick={handleSave}
        >
          Save
        </Button>
      </Stack>
    </VStack>
  );
}

export default Settings;
