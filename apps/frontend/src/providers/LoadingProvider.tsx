import BackgroundImageNoise from 'assets/images/background-image-noise.png';
import BackgroundBlur from 'assets/images/background-blur.svg';
import BackgroundSpiral from 'assets/images/background-spiral.svg';
import LoadingOverlay from 'react-loading-overlay-ts';
import styled from 'styled-components';

export const LoadingProvider = styled(LoadingOverlay)`
  height: 100%;
  width: 100%;

  display: flex;

  background-image:
    url(${BackgroundSpiral}), url(${BackgroundSpiral}), url(${BackgroundBlur}),
    url(${BackgroundImageNoise});

  background-repeat: no-repeat, no-repeat, no-repeat, repeat;

  background-size:
    785px 980px,
    785px 980px,
    80% 80%,
    50px 50px;

  background-position:
    left -200px top -350px,
    right -190px bottom -240px,
    -150% 250%,
    0 0;
`;
