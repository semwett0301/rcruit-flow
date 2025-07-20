import React from 'react';
import { Button } from 'ui/Button';
import { ChevronRightIcon, Cross1Icon } from '@radix-ui/react-icons';
import { SquaredButton } from 'ui/SquareButton';
// import { FileUpload } from 'ui/FileUpload';

const Home = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#1943AD',
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
      <div>{/*<FileUpload />*/}</div>
    </div>
  );
};

export default Home;
