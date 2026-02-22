import { useEffect, useState } from 'react';
import DiaryInput from '../components/DiaryInput';
import EmpathyResult from '../components/EmpathyResult';
import { postDiaryEmpathy } from '../api/empathy';
import {createDiary, listDiaries, deleteDiary} from '../api/diaries';
import {useParams} from 'react-router-dom';

import './DiaryPage.css';

export default function DiaryPage() {
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const {date} = useParams(); //url에서 날짜 정보 가져오기
  const [existingDiaries, setExistingDiaries] = useState(null); //기존 일기 목록 상태 추가
  //Diary Iput 에서 일기 내용을 넘겨줌 (text인가는 사용자가 입력한 일기 문자열 )

  useEffect(() => {
    const fetchExisting = async() =>{
      try{
        const diaries = await listDiaries(); //백엔드에서 일기 목록 가져오는 함수 (api/diaries.js에 구현)
        const found = diaries?.find(d => d.date === date); //가져온 일기 목록에서 url의 날짜와 일치하는 일기 찾기
        setExistingDiaries(found); //일기가 있으면 상태에
      }
      catch{

      } //일기 목록 불러오기 실패해도 그냥 넘어감 (기존 일기가 없다고 간주)
    } ;fetchExisting(); //
  }, [date]);//페이지가 열릴 때마다 해당 날짜의 기존 일기 불러오기


  const handleSubmit = async ({ title, content }) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await postDiaryEmpathy({ //아래 정보들을 백엔드로 보내서 공감 결과 받아오기 (api/empathy.js에 구현)
        date: date,
        content,
        title,
      });
      setResult(data); //이때 data 상태를 변경 
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveDiary = async ({ title, content }) => {
    try{
      const saved = await createDiary({ date, title, content }); //백엔드로 일기 저장 요청 보내는 함수 (api/diaries.js에 구현)
      setExistingDiaries(saved); //저장된 일기를 기존 일기 상태에 반영
    } catch(err){
        setError(err instanceof Error ? err.message : '일기 저장 중 오류가 발생했습니다.');
      }
    }

  const handleDelete = async () =>{
    if (!existingDiaries) return; //삭제할 일기가 없으면 그냥 반환
    try{
      await deleteDiary(existingDiaries.id); //백엔드로 일기 삭제 요청 보내는 함수 (api/diary.js에 구현)
      setExistingDiaries(null); //삭제 성공하면 기존 일기 상태 초기화
      setResult(null); //공감 결과도 초기화
    }
    catch(err){
      setError(err instanceof Error ? err.message : '일기 삭제 중 오류가 발생했습니다.');
    }
  }

  //handlesubmit함수를 DiartyInput에 전달 
  return (
    <div className="diary-page">

      <DiaryInput onSubmit={handleSubmit} onSave={saveDiary} isLoading={isLoading} date={date} /> 
    {existingDiaries && (
        <div className="diary-page__existing">
          <button onClick = {handleDelete} className = "delete-button">일기 삭제</button>
          <p><strong>{existingDiaries.title}</strong></p>
          </div>
    )}
      {error && (
        <div className="diary-page__error">
          {error}
        </div>
      )}

      {result && <EmpathyResult data={result} />}
    </div>
  );
}
