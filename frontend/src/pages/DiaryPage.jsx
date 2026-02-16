import { useState } from 'react';
import DiaryInput from '../components/DiaryInput';
import EmpathyResult from '../components/EmpathyResult';
import { postDiaryEmpathy } from '../api/empathy';


import './DiaryPage.css';

export default function DiaryPage() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (text) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await postDiaryEmpathy(text);
      setResult(data); //이때 data 상태를 변경 
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  //handlesubmit함수를 DiartyInput에 전달 
  return (
    <div className="diary-page">

      <DiaryInput onSubmit={handleSubmit} isLoading={isLoading} />

      {error && (
        <div className="diary-page__error">
          {error}
        </div>
      )}

      {result && <EmpathyResult data={result} />}
    </div>
  );
}
