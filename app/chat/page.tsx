'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function ChatPage() {
  const [count, setCount] = useState<number | null>(null);
  const [input, setInput] = useState<string>('');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from('chat_counter')
        .select('count')
        .eq('id', 1)
        .single();

      if (error) {
        console.error(error);
        return;
      }
      if (data?.count !== undefined) setCount(Number(data.count));
    })();
  }, []);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (count === null) return;

    const next = count + 1;
    setCount(next);

    const { error } = await supabase
      .from('chat_counter')
      .update({ count: next })
      .eq('id', 1);

    if (error) {
      setCount(count);
      alert('카운트 업데이트 실패: ' + error.message);
    }
    setInput('');
  };

  return (
    <main style={{ maxWidth: 520, margin: '40px auto', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: 28, marginBottom: 12 }}>Chat Demo</h1>
      <p style={{ color: '#666', marginBottom: 20 }}>
        입력 후 전송하면 Supabase의 카운트를 +1 하고 <code>Hello&#123;count&#125;</code> 출력
      </p>

      <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
          style={{ flex: 1, padding: '10px 12px', border: '1px solid #ccc', borderRadius: 8 }}
          required
        />
        <button
          type="submit"
          style={{ padding: '10px 16px', border: '1px solid #222', borderRadius: 8, background: '#111', color: '#fff' }}
        >
          보내기
        </button>
      </form>

      <div style={{ padding: 12, border: '1px solid #eee', borderRadius: 8 }}>
        {count === null ? '불러오는 중...' : `Hello${count}`}
      </div>
    </main>
  );
}