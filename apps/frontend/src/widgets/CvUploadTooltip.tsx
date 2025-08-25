import { PropsWithChildren } from 'react';
import styled from 'styled-components';
import { Tooltip } from 'ui/components/Tooltip';
import { extractFontPreset } from 'theme/utils/extractFontPreset';

const TooltipContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  width: 100%;

  ${({ theme }) => extractFontPreset('regular')(theme)}
`;

const CustomList = styled.ul`
  padding-left: ${({ theme }) => theme.spacing.s};
`;

export const CvUploadTooltip = ({ children }: PropsWithChildren) => {
  return (
    <Tooltip
      content={
        <TooltipContentWrapper>
          <div>The CV ideally must contain:</div>
          <CustomList>
            <li>Candidate name</li>
            <li>Current employer</li>
            <li>Current position</li>
            <li>Age</li>
            <li>Location</li>
            <li>Hard skills</li>
            <li>Experience description</li>
            <li>Years of experience</li>
            <li>Degree</li>
          </CustomList>
        </TooltipContentWrapper>
      }
    >
      {children}
    </Tooltip>
  );
};
