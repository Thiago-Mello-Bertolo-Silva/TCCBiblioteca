// // src/components/ErrorBoundary.tsx
// import { Component, ReactNode } from "react";

// type Props = { children: ReactNode };
// type State = { hasError: boolean };

// export class ErrorBoundary extends Component<Props, State> {
//   state: State = { hasError: false };

//   static getDerivedStateFromError() {
//     return { hasError: true };
//   }

//   componentDidCatch(err: unknown) {
//     console.error("Erro capturado no ErrorBoundary:", err);
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div className="flex flex-col items-center justify-center h-screen text-center p-8">
//           <h1 className="text-3xl font-bold text-red-600">Algo deu errado</h1>
//           <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
//             Tente recarregar a página ou voltar mais tarde.
//           </p>
//         </div>
//       );
//     }
//     return this.props.children;
//   }
// }
