import React from 'react';
import { Button } from 'ui/Button';
import { ChevronRightIcon } from '@radix-ui/react-icons';

const Home: React.FC = () => {
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
        <Button disabled>Press</Button>
      </div>
    </div>
  );
};

export default Home;
