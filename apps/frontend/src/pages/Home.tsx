import React, { useState } from 'react';
import { Button } from 'components/Button';
import { ChevronRightIcon, Cross1Icon } from '@radix-ui/react-icons';
import { SquaredButton } from 'components/SquareButton';
import { FileUpload } from 'components/FileUpload';
import { Checkbox } from 'components/Checkbox';
import { Switch } from 'components/Switch';
// import { FileUpload } from 'components/FileUpload';

const Home = () => {
  const [enValue, setEnValue] = useState<string>('EN');

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
      <div style={{ marginTop: '20px' }}>
        <Switch
          value={enValue}
          onSwitch={(value) => {
            setEnValue(value);
          }}
          options={[
            {
              label: 'EN',
              value: 'EN',
            },
            {
              label: 'NL',
              value: 'NL',
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Home;
