import styled from 'styled-components';
import { Textarea } from 'ui/Textarea';
import { Button } from 'ui/Button';
import { CopyIcon, ReloadIcon } from '@radix-ui/react-icons';

export type EmailGenerationFormState = {
  message: string;
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  height: 100%;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  width: 100%;
`;

interface EmailGenerationForm {
  state?: EmailGenerationFormState;
  onGenerate: () => void;
  onChange: (text: string) => void;
  onCopy: (text: string) => void;
}

export const EmailGenerationForm = ({
  state,
  onGenerate,
  onCopy,
  onChange,
}: EmailGenerationForm) => {
  return (
    <Container>
      <Textarea
        height="100%"
        value={state?.message}
        onChange={(e) => {
          const newValue = e.target.value;

          onChange(newValue);
        }}
      />

      <ButtonRow>
        <Button variant="outline" onClick={onGenerate}>
          <ReloadIcon style={{ marginRight: 8 }} />
          Generate again
        </Button>
        <Button
          variant="outline"
          onClick={() => state?.message && onCopy(state.message)}
        >
          <CopyIcon style={{ marginRight: 8 }} />
          Copy
        </Button>
      </ButtonRow>
    </Container>
  );
};
