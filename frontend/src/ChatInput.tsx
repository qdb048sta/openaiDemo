import React, { useState } from "react";
import { Container, Content } from "./styles";
import { styled } from "styled-components";
import { ErrorData, QUERY_KEYS, postAi } from "./api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const InputContainer = styled.div`
  display: flex;
  input {
    flex-grow: 1;
    margin-right: 1rem;
  }
`;

const ChatInput = ({ errorData }: { errorData: ErrorData | undefined }) => {
  const [value, setValue] = useState("");
  const queryClient = useQueryClient();
  const { isPending, mutate } = useMutation({
    mutationFn: postAi,
    onMutate: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getAi] });
      }, 500);
    },
    onSuccess: () => {
      setValue("");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getAi] });
    },
  });
  const { key = "" } = errorData || {};
  return (
    <Container>
      <Content>
        <InputContainer>
          <input value={value} onChange={(e) => setValue(e.target.value)} />
          <button
            disabled={isPending || errorData?.status === "pending"}
            onClick={() => {
              if (!value) return;
              mutate({ error: key, input: value });
            }}
          >
            Submit
          </button>
        </InputContainer>
      </Content>
    </Container>
  );
};

export default ChatInput;
