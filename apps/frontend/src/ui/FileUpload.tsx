// import { useRef, useState } from 'react';
// import styled, { css } from 'styled-components';
// import { Button } from './Button';
//
// export type UploadState = 'default' | 'success' | 'error';
//
// interface FileUploadProps {
//   onFileSelect?: (file: File) => void;
//   onFileRemove?: () => void;
//   acceptedTypes?: string[];
//   uploadState?: UploadState;
// }
//
// interface StyledUploadAreaProps {
//   $state: UploadState;
//   $isDragOver: boolean;
// }
//
// const UploadContainer = styled.div`
//   width: 100%;
//   max-width: 400px;
// `;
//
// const UploadArea = styled.div<StyledUploadAreaProps>`
//   position: relative;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: center;
//   padding: 40px 20px;
//   border-radius: 12px;
//   border: 2px dashed ${({ theme }) => theme.colors.purple || '#8b5cf6'};
//   cursor: pointer;
//   transition: all 0.3s ease;
//   min-height: 200px;
//
//   ${({ $state, $isDragOver }) => {
//     switch ($state) {
//       case 'default':
//         return css`
//           background-color: ${({ theme }) =>
//             theme.colors.backgroundBlue || '#1e3a8a'};
//           ${$isDragOver &&
//           css`
//             background-color: ${({ theme }) =>
//               theme.colors.darkerBlue || '#1e40af'};
//             border-color: ${({ theme }) => theme.colors.white || '#ffffff'};
//           `}
//         `;
//       case 'success':
//         return css`
//           background-color: ${({ theme }) => theme.colors.success || '#059669'};
//         `;
//       case 'error':
//         return css`
//           background-color: ${({ theme }) => theme.colors.error || '#dc2626'};
//         `;
//       default:
//         return css``;
//     }
//   }}
// `;
//
// const UploadIcon = styled.div<{ $state: UploadState }>`
//   font-size: 48px;
//   margin-bottom: 16px;
//   color: ${({ theme }) => theme.colors.white || '#ffffff'};
//
//   ${({ $state }) =>
//     $state === 'error' &&
//     css`
//       color: ${({ theme }) => theme.colors.error || '#dc2626'};
//     `}
// `;
//
// const UploadText = styled.div<{ $state: UploadState }>`
//   text-align: center;
//   color: ${({ theme }) => theme.colors.white || '#ffffff'};
//   font-size: 16px;
//   font-weight: 500;
//   margin-bottom: 8px;
//
//   ${({ $state }) =>
//     $state === 'error' &&
//     css`
//       color: ${({ theme }) => theme.colors.error || '#dc2626'};
//     `}
// `;
//
// const FileName = styled.div`
//   color: ${({ theme }) => theme.colors.white || '#ffffff'};
//   font-size: 14px;
//   opacity: 0.8;
//   margin-bottom: 16px;
// `;
//
// const HiddenInput = styled.input`
//   display: none;
// `;
//
// const RemoveButton = styled(Button)`
//   background-color: ${({ theme }) => theme.colors.white || '#ffffff'};
//   color: ${({ theme }) => theme.colors.black || '#000000'};
//   border: 1px solid ${({ theme }) => theme.colors.black || '#000000'};
//
//   &:hover {
//     background-color: ${({ theme }) => theme.colors.gray || '#f3f4f6'};
//   }
// `;
//
// export const FileUpload = ({
//   onFileSelect,
//   onFileRemove,
//   uploadState = 'default',
//   acceptedTypes = ['.pdf', '.txt'],
// }: FileUploadProps) => {
//   const [isDragOver, setIsDragOver] = useState(false);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//
//   const handleFileSelect = (file: File) => {
//     setSelectedFile(file);
//     onFileSelect?.(file);
//   };
//
//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       handleFileSelect(file);
//     }
//   };
//
//   const handleDragOver = (event: React.DragEvent) => {
//     event.preventDefault();
//     setIsDragOver(true);
//   };
//
//   const handleDragLeave = (event: React.DragEvent) => {
//     event.preventDefault();
//     setIsDragOver(false);
//   };
//
//   const handleDrop = (event: React.DragEvent) => {
//     event.preventDefault();
//     setIsDragOver(false);
//
//     const file = event.dataTransfer.files[0];
//     if (file) {
//       handleFileSelect(file);
//     }
//   };
//
//   const handleClick = () => {
//     if (uploadState === 'default') {
//       fileInputRef.current?.click();
//     }
//   };
//
//   const handleRemove = () => {
//     setSelectedFile(null);
//     setUploadState('default');
//     onFileRemove?.();
//     if (fileInputRef.current) {
//       fileInputRef.current.value = '';
//     }
//   };
//
//   const getUploadContent = () => {
//     switch (uploadState) {
//       case 'success':
//         return (
//           <>
//             <UploadIcon $state={uploadState}>✓</UploadIcon>
//             <UploadText $state={uploadState}>
//               File upload is complete
//             </UploadText>
//             {selectedFile && <FileName>{selectedFile.name}</FileName>}
//             <RemoveButton onClick={handleRemove}>Remove file</RemoveButton>
//           </>
//         );
//       case 'error':
//         return (
//           <>
//             <UploadIcon $state={uploadState}>✕</UploadIcon>
//             <UploadText $state={uploadState}>
//               Incorrect file format, check the file and try again
//             </UploadText>
//             {selectedFile && <FileName>{selectedFile.name}</FileName>}
//             <RemoveButton onClick={handleRemove}>Remove file</RemoveButton>
//           </>
//         );
//       default:
//         return (
//           <>
//             <UploadIcon $state={uploadState}>↑</UploadIcon>
//             <UploadText $state={uploadState}>
//               Drag your resume here ({acceptedTypes.join(', ')}) or click to
//               upload
//             </UploadText>
//           </>
//         );
//     }
//   };
//
//   return (
//     <UploadContainer>
//       <UploadArea
//         $state={uploadState}
//         $isDragOver={isDragOver}
//         onClick={handleClick}
//         onDragOver={handleDragOver}
//         onDragLeave={handleDragLeave}
//         onDrop={handleDrop}
//       >
//         {getUploadContent()}
//       </UploadArea>
//       <HiddenInput
//         ref={fileInputRef}
//         type="file"
//         accept={acceptedTypes.join(',')}
//         onChange={handleInputChange}
//       />
//     </UploadContainer>
//   );
// };
