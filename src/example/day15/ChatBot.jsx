import React, { useState, useRef, useEffect } from 'react';

const BACKEND_BASE_URL = 'http://localhost:8080';

// 4가지 핵심 물류 업무 서비스 정의
const SERVICES = [
  {
    key: 'chat1',
    code: '01',
    title: 'LLM API',
    desc: 'LLM 에게 프롬프트 보내기',
    auto: false,
    placeholder: '여기에 프롬프트 작성하기',
    initialPrompt: null
  },
  {
    key: 'chat2',
    code: '02',
    title: '배송·반품 관제 리포트',
    desc: '허브별 지연율, 파손 사고 및 클레임 패턴 데이터 분석',
    auto: true,
    placeholder: '파라미터 없음 (즉시 분석 실행)',
    initialPrompt: null
  },
  {
    key: 'chat3',
    code: '03',
    title: '클레임 대응 파이프라인',
    desc: '1차 원인 판정 → 2차 보상안 → 3차 고객 사과문 작성',
    auto: false,
    placeholder: '접수된 고객 클레임 전문을 입력하세요',
    initialPrompt: null
  },
  {
    key: 'chat4',
    code: '04',
    title: '배송 CS 자동 라우팅',
    desc: '주문번호 기반 배송 추적, 반품 회수, 파손/지연 보상 신청',
    auto: false,
    placeholder: '요청 사항과 주문번호를 입력하세요 (예: ORD-202610-001 보상 신청)',
    initialPrompt: null
  }
];

export default function ChatBot() {
  const [activeService, setActiveService] = useState(null); // null이면 기본 라우터 모드
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      type: 'welcome',
      text: '물류 운영 관제 및 고객 CS 지원 시스템입니다.\n원하시는 업무 카드를 선택하시거나, 하단 입력창에 주문번호와 함께 문의 사항을 바로 입력해 주세요.',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // 응답 포맷터
  const formatBotResponse = (data) => {
    if (typeof data === 'string') {
      if (data.trim().startsWith('<!doctype') || data.trim().startsWith('<html')) {
        return '서버 응답 오류: 서비스 게이트웨이와 통신할 수 없습니다. 시스템 상태를 확인해 주세요.';
      }
      return data;
    }
    if (typeof data === 'object' && data !== null) {
      return JSON.stringify(data, null, 2);
    }
    return String(data);
  };

  // 인라인 스타일 파서 (**볼드**, `인라인코드`)
  const parseInlineStyles = (text) => {
    if (!text) return '';
    const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);

    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} style={styles.boldText}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return <code key={index} style={styles.inlineCode}>{part.slice(1, -1)}</code>;
      }
      return part;
    });
  };

  // 마크다운 표 렌더러
  const renderTable = (tableLines, keyPrefix) => {
    if (tableLines.length === 0) return null;

    const parseRow = (rowStr) => rowStr.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(c => c.trim());
    const headerCells = parseRow(tableLines[0]);
    let alignments = [];
    let dataRowStartIndex = 1;

    if (tableLines.length > 1 && /^\|?(\s*:?-+:?\s*\|?)+$/.test(tableLines[1].trim())) {
      const alignTokens = parseRow(tableLines[1]);
      alignments = alignTokens.map(token => {
        const left = token.startsWith(':');
        const right = token.endsWith(':');
        if (left && right) return 'center';
        if (right) return 'right';
        return 'left';
      });
      dataRowStartIndex = 2;
    }

    const bodyRows = tableLines.slice(dataRowStartIndex).map(line => parseRow(line));

    return (
      <div key={keyPrefix} style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              {headerCells.map((th, i) => (
                <th key={i} style={{ ...styles.tableTh, textAlign: alignments[i] || 'left' }}>
                  {parseInlineStyles(th)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, rIdx) => (
              <tr key={rIdx} style={{ backgroundColor: rIdx % 2 === 1 ? '#f8fafc' : '#ffffff' }}>
                {row.map((cell, cIdx) => (
                  <td key={cIdx} style={{ ...styles.tableTd, textAlign: alignments[cIdx] || 'left' }}>
                    {parseInlineStyles(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // 본문 서식 렌더러
  const renderFormattedText = (rawText) => {
    if (!rawText) return null;

    const lines = rawText.split('\n');
    const elements = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];
      const trimmed = line.trim();

      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        const tableLines = [];
        while (i < lines.length && lines[i].trim().startsWith('|') && lines[i].trim().endsWith('|')) {
          tableLines.push(lines[i]);
          i++;
        }
        elements.push(renderTable(tableLines, `table-${i}`));
        continue;
      }

      if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        elements.push(<hr key={`hr-${i}`} style={styles.divider} />);
        i++;
        continue;
      }

      if (!trimmed) {
        elements.push(<div key={`blank-${i}`} style={{ height: '8px' }} />);
        i++;
        continue;
      }

      // 4-1. 소소제목 (##### Heading 5)
      if (line.startsWith('##### ')) {
        const titleContent = line.replace(/^#####\s*/, '');
        elements.push(
          <div key={`heading5-${i}`} style={styles.heading5Line}>
            {parseInlineStyles(titleContent)}
          </div>
        );
        i++;
        continue;
      }

      // 4-2. 소제목 (#### Heading 4) 대응
      if (line.startsWith('#### ')) {
        const titleContent = line.replace(/^####\s*/, '');
        elements.push(
          <div key={`heading4-${i}`} style={styles.heading4Line}>
            {parseInlineStyles(titleContent)}
          </div>
        );
        i++;
        continue;
      }

      // 4-3. 중/대제목 (##, ###)
      if (line.startsWith('### ') || line.startsWith('## ')) {
        const titleContent = line.replace(/^#{2,3}\s*/, '');
        elements.push(
          <div key={`heading-${i}`} style={styles.headingLine}>
            {parseInlineStyles(titleContent)}
          </div>
        );
        i++;
        continue;
      }



      const bulletMatch = line.match(/^(\s*)([*•\-])\s+(.*)/);
      if (bulletMatch) {
        const indentLevel = Math.floor(bulletMatch[1].length / 2);
        elements.push(
          <div key={`bullet-${i}`} style={{ ...styles.bulletLine, paddingLeft: `${14 + indentLevel * 14}px` }}>
            <span style={styles.bulletDot}>•</span>
            <span style={{ flex: 1 }}>{parseInlineStyles(bulletMatch[3])}</span>
          </div>
        );
        i++;
        continue;
      }

      const numMatch = line.match(/^(\s*)(\d+[\.\)])\s+(.*)/);
      if (numMatch) {
        const indentLevel = Math.floor(numMatch[1].length / 2);
        elements.push(
          <div key={`num-${i}`} style={{ ...styles.numberedLine, paddingLeft: `${14 + indentLevel * 14}px` }}>
            <span style={styles.numberPrefix}>{numMatch[2]}</span>
            <span style={{ flex: 1 }}>{parseInlineStyles(numMatch[3])}</span>
          </div>
        );
        i++;
        continue;
      }

      elements.push(
        <div key={`normal-${i}`} style={styles.normalLine}>
          {parseInlineStyles(line)}
        </div>
      );
      i++;
    }

    return elements;
  };

  // API 호출 트리거
  const executeApi = async (serviceKey, payloadText) => {
    setLoading(true);
    try {
      let url = `${BACKEND_BASE_URL}/api/${serviceKey}?_t=${Date.now()}`;

      if (serviceKey === 'chat1') {
        url += `&prompt=${encodeURIComponent(payloadText)}`;
      } else if (serviceKey === 'chat3') {
        url += `&topic=${encodeURIComponent(payloadText)}`;
      } else if (serviceKey === 'chat4') {
        url += `&userMessage=${encodeURIComponent(payloadText)}`;
      }

      const res = await fetch(url, {
        method: 'GET',
        headers: { 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch (e) {
        data = rawText;
      }

      const reply = formatBotResponse(data);
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: `요청 처리 중 오류가 발생했습니다: ${err.message}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 카드 메뉴 클릭 핸들러
  const handleSelectServiceCard = (service) => {
    setActiveService(service);

    if (service.auto) {
      // 2번: 즉시 백엔드 분석 리포트 실행
      const userText = `[리포트 생성] ${service.title}`;
      const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: userText, time: now }]);
      executeApi(service.key, '');
    } else {
      // 입력형: 인풋창으로 포커스 유도 및 예시 세팅
      if (service.initialPrompt) {
        setInputMessage(service.initialPrompt);
      }
    }
  };

  // 메시지 전송
  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const currentKey = activeService ? activeService.key : 'chat1';
    const textToSend = inputMessage.trim();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text: textToSend, time: now }]);
    setInputMessage('');

    executeApi(currentKey, textToSend);
  };

  return (
    <div style={styles.container}>
      {/* 엔터프라이즈 CS 헤더 */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.statusIndicator} />
          <div>
            <h1 style={styles.headerTitle}>물류 CS 챗봇</h1>
            <p style={styles.headerSubtitle}>실시간 배송 조회 · 반품 및 보상 접수 시스템</p>
          </div>
        </div>
      </header>

      {/* 대화 피드 */}
      <main style={styles.chatArea}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              ...styles.messageRow,
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start'
            }}
          >
            {msg.sender === 'bot' && <div style={styles.botIcon}>CS</div>}

            <div
              style={{
                ...styles.bubble,
                ...(msg.sender === 'user' ? styles.userBubble : styles.botBubble)
              }}
            >
              <div style={styles.messageContent}>
                {msg.sender === 'bot' ? renderFormattedText(msg.text) : msg.text}
              </div>

              {/* 웰컴 메시지 내부의 업무 바로가기 메뉴 카드 */}
              {msg.type === 'welcome' && (
                <div style={styles.menuGrid}>
                  {SERVICES.map(service => (
                    <button
                      key={service.key}
                      onClick={() => handleSelectServiceCard(service)}
                      style={{
                        ...styles.menuCard,
                        borderColor: activeService?.key === service.key ? '#2563eb' : '#e2e8f0',
                        backgroundColor: activeService?.key === service.key ? '#f0f7ff' : '#ffffff'
                      }}
                    >
                      <div style={styles.cardHeader}>
                        <span style={styles.cardCode}>{service.code}</span>
                        <span style={styles.cardTitle}>{service.title}</span>
                      </div>
                      <p style={styles.cardDesc}>{service.desc}</p>
                      <span style={styles.cardAction}>
                        {service.auto ? '즉시 실행하기 →' : '입력 작성하기 →'}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <span
                style={{
                  ...styles.timestamp,
                  color: msg.sender === 'user' ? '#93c5fd' : '#94a3b8'
                }}
              >
                {msg.time}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div style={styles.messageRow}>
            <div style={styles.botIcon}>CS</div>
            <div style={{ ...styles.bubble, ...styles.botBubble, color: '#64748b' }}>
              <span style={styles.typingIndicator}>데이터베이스 조회 및 물류 분석 중...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* 하단 입력 폼 영역 */}
      <footer style={styles.inputContainer}>
        {/* 현재 활성화된 모드 배지 (있을 경우만 표시) */}
        {activeService && (
          <div style={styles.activeServiceBanner}>
            <span style={styles.activeServiceText}>
              <strong>[{activeService.code}] {activeService.title}</strong> 모드 적용 중
            </span>
            <button
              onClick={() => setActiveService(null)}
              style={styles.resetModeBtn}
            >
              기본 라우팅으로 복귀 ✕
            </button>
          </div>
        )}

        <form onSubmit={handleSend} style={styles.inputForm}>
          <input
            type="text"
            value={inputMessage}
            onChange={e => setInputMessage(e.target.value)}
            disabled={loading}
            placeholder={
              activeService
                ? activeService.placeholder
                : '여기에 프롬프트 작성하기'
            }
            style={styles.input}
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            style={{
              ...styles.submitBtn,
              opacity: loading || !inputMessage.trim() ? 0.45 : 1
            }}
          >
            전송
          </button>
        </form>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    width: '660px',
    height: '780px',
    margin: '24px auto',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 12px 36px rgba(15, 23, 42, 0.08)',
    border: '1px solid #e2e8f0',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    overflow: 'hidden'
  },
  header: {
    backgroundColor: '#0f172a',
    padding: '16px 22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: '1px solid #1e293b'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  statusIndicator: {
    width: '9px',
    height: '9px',
    borderRadius: '50%',
    backgroundColor: '#22c55e',
    boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)'
  },
  headerTitle: {
    margin: 0,
    fontSize: '15px',
    fontWeight: '600',
    color: '#f8fafc',
    letterSpacing: '-0.3px'
  },
  headerSubtitle: {
    margin: 0,
    fontSize: '11.5px',
    color: '#94a3b8',
    marginTop: '2px'
  },
  liveBadge: {
    backgroundColor: '#1e293b',
    color: '#38bdf8',
    fontSize: '10px',
    fontWeight: '700',
    padding: '3px 8px',
    borderRadius: '4px',
    letterSpacing: '0.6px',
    border: '1px solid #334155'
  },
  chatArea: {
    flex: 1,
    padding: '20px',
    overflowY: 'auto',
    backgroundColor: '#f8fafc',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  messageRow: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-start'
  },
  botIcon: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    backgroundColor: '#0f172a',
    color: '#38bdf8',
    fontSize: '11px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: '2px'
  },
  bubble: {
    maxWidth: '88%',
    padding: '13px 16px',
    borderRadius: '8px',
    fontSize: '13.5px',
    lineHeight: '1.6',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
  },
  userBubble: {
    backgroundColor: '#1d4ed8',
    color: '#ffffff',
    borderTopRightRadius: '2px'
  },
  botBubble: {
    backgroundColor: '#ffffff',
    color: '#1e293b',
    border: '1px solid #e2e8f0',
    borderTopLeftRadius: '2px'
  },
  messageContent: {
    wordBreak: 'break-word'
  },
  // 웰컴 메시지 내부 2x2 카드 그리드
  menuGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    marginTop: '12px'
  },
  menuCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    textAlign: 'left',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
    cursor: 'pointer',
    transition: 'all 0.15s ease'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '4px'
  },
  cardCode: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#2563eb',
    backgroundColor: '#eff6ff',
    padding: '2px 5px',
    borderRadius: '3px'
  },
  cardTitle: {
    fontSize: '12.5px',
    fontWeight: '600',
    color: '#0f172a'
  },
  cardDesc: {
    margin: 0,
    fontSize: '11px',
    color: '#64748b',
    lineHeight: '1.4',
    marginBottom: '8px'
  },
  cardAction: {
    fontSize: '10.5px',
    fontWeight: '600',
    color: '#2563eb',
    marginTop: 'auto'
  },
  // 테이블 서식
  tableWrapper: {
    overflowX: 'auto',
    margin: '10px 0',
    borderRadius: '4px',
    border: '1px solid #cbd5e1'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '12px'
  },
  tableTh: {
    backgroundColor: '#f1f5f9',
    color: '#0f172a',
    fontWeight: '600',
    padding: '8px 10px',
    borderBottom: '1px solid #cbd5e1',
    whiteSpace: 'nowrap'
  },
  tableTd: {
    padding: '7px 10px',
    borderBottom: '1px solid #e2e8f0',
    color: '#334155'
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #e2e8f0',
    margin: '12px 0'
  },
  headingLine: {
    fontWeight: '700',
    fontSize: '14.5px',
    marginTop: '8px',
    marginBottom: '4px',
    color: '#0f172a'
  },
  bulletLine: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px',
    margin: '3px 0'
  },
  bulletDot: {
    color: '#2563eb',
    fontWeight: 'bold',
    fontSize: '13px',
    lineHeight: '1.4'
  },
  numberedLine: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '6px',
    margin: '3px 0'
  },
  numberPrefix: {
    color: '#2563eb',
    fontWeight: '600',
    minWidth: '16px'
  },
  normalLine: {
    margin: '2px 0'
  },
  boldText: {
    fontWeight: '600',
    color: '#0f172a'
  },
  inlineCode: {
    backgroundColor: '#f1f5f9',
    color: '#dc2626',
    padding: '1px 5px',
    borderRadius: '3px',
    fontSize: '12px',
    fontFamily: 'Consolas, monospace'
  },
  timestamp: {
    fontSize: '10px',
    marginTop: '6px',
    display: 'block',
    textAlign: 'right'
  },
  typingIndicator: {
    fontSize: '12px',
    fontStyle: 'italic'
  },
  inputContainer: {
    padding: '12px 18px 16px',
    backgroundColor: '#ffffff',
    borderTop: '1px solid #e2e8f0'
  },
  activeServiceBanner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#eff6ff',
    padding: '6px 12px',
    borderRadius: '4px',
    marginBottom: '8px',
    fontSize: '11.5px',
    color: '#1e40af'
  },
  activeServiceText: {
    flex: 1
  },
  resetModeBtn: {
    background: 'none',
    border: 'none',
    color: '#64748b',
    fontSize: '11px',
    cursor: 'pointer',
    padding: '0 4px',
    fontWeight: '500'
  },
  inputForm: {
    display: 'flex',
    gap: '8px'
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    outline: 'none',
    fontSize: '13.5px',
    color: '#0f172a'
  },
  submitBtn: {
    padding: '0 18px',
    backgroundColor: '#0f172a',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease'
  }
};