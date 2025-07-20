import React from 'react';
import { Button } from 'components/Button';
import { ChevronRightIcon, Cross1Icon } from '@radix-ui/react-icons';
import { SquaredButton } from 'components/SquareButton';
import { FileUpload } from 'components/FileUpload';
import { Checkbox } from 'components/Checkbox';
// import { FileUpload } from 'components/FileUpload';

const Home = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
      }}
    >
      <div>
        <Button
          leftIcon={<ChevronRightIcon />}
          rightIcon={<ChevronRightIcon />}
        >
          Next step
        </Button>
        <Button variant="outline">Press</Button>
        <Button>1</Button>
        <Button disabled>Press</Button>
      </div>
      <div style={{ marginTop: '10px' }}>
        <SquaredButton>1</SquaredButton>
        <SquaredButton variant="outline" size="xs">
          <Cross1Icon />
        </SquaredButton>
      </div>
      <div>
        <FileUpload />
      </div>
      <div>
        <Checkbox label="dasd" />
      </div>
    </div>
  );
};

export default Home;
