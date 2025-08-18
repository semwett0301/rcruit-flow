// import styled, { css } from 'styled-components';
// import { extractFontPreset } from 'theme/utils/extractFontPreset';
// import { AuthForm, AuthFormState } from 'forms/AuthForm';
// import { useAuth } from 'hooks/useAuth';
// import { useEffect, useState } from 'react';
// import { remove } from '@ebay/nice-modal-react';
// import { SimpleModal } from 'modals/SimpleModal';
//
// const BodyModal = styled.div`
//   display: flex;
//   flex-direction: column;
//
//   width: 340px;
//
//   gap: ${({ theme }) => theme.spacing.m};
// `;
//
// const TitleContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//
//   ${({ theme }) => css`
//     gap: ${theme.spacing.xs};
//
//     padding: 0 ${theme.spacing.s};
//
//     color: ${theme.colors.white};
//   `}
// `;
//
// const AuthHeader = styled.h1`
//   ${({ theme }) => extractFontPreset('firstHeading')(theme)}
// `;
//
// const AuthText = styled.p`
//   text-align: center;
//   ${({ theme }) => extractFontPreset('regular')(theme)}
// `;
//
// export const ResetBodyModal = () => {
//   const { getUser, registerUser } = useAuth();
//   const [user, setUser] = useState<Partial<AuthFormState>>();
//
//   useEffect(() => {
//     setUser(getUser());
//   }, []);
//
//   return (
//     <BodyModal>
//       <TitleContainer>
//         <AuthHeader>Enter user details</AuthHeader>
//         <AuthText>
//           Share your details for a personalised experience and secure your
//           information.
//         </AuthText>
//       </TitleContainer>
//       <AuthForm
//         values={user}
//         onSubmit={(newUserData) => {
//           registerUser(newUserData);
//           setUser(newUserData);
//           remove(SimpleModal);
//         }}
//       />
//     </BodyModal>
//   );
// };
