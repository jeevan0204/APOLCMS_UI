import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

const usePrint = ({title}) => {
  const componentRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: title,
  });

  return {
    componentRef,
    handlePrint,
  };
};

export default usePrint;
