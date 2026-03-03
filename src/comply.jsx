import { useState, useCallback, useRef, useEffect } from "react";

/* ── 디자인 가이드 v1.0 컬러 시스템 ── */
const BASE = {
  /* Neutral */
  white: "#fff",
  bg: "#F9FAFC",           /* neutral-c50 페이지 배경 */
  brd: "#EEEEEE",          /* neutral-300 input/테이블 구분선 */
  brdD: "#D7D7D7",         /* neutral-400 구분 라인 */
  txt: "#333333",          /* neutral-800 본문 텍스트 */
  txS: "#666666",          /* neutral-700 sub 텍스트 */
  txL: "#929292",          /* neutral-600 보조 텍스트 */
  txX: "#BBBBBB",          /* neutral-500 placeholder */
  txH: "#111111",          /* neutral-900 제목 */
  bgSec: "#E9ECF3",        /* neutral-c100 구분선 영역 */
  /* Semantic */
  red: "#E24949",
  green: "#19973C",
};
const THEME = {
  m: { pri: "#339CD5", priL: "#E6F3FA", priD: "#2580AF", sec: "#457CE1", secL: "#457CE11A", brand: "#005CB9", brandD: "#004A94", brandG: "linear-gradient(135deg, #005cb9 0%, #339cd5 100%)", brandBg: "linear-gradient(160deg, #003e82 0%, #005CB9 60%, #0a2a5e 100%)", accent: "#0C8CE9" },
  s: { pri: "#19973C", priL: "#E8F5EC", priD: "#147A30", sec: "#19973C", secL: "#19973C1A", brand: "#15803D", brandD: "#116632", brandG: "linear-gradient(135deg, #15803D 0%, #19973C 100%)", brandBg: "linear-gradient(160deg, #0a4a20 0%, #15803D 60%, #0a3318 100%)", accent: "#19973C" },
};
const sideTheme = {
  m: { active: "#339CD51A", activeTxt: "#339CD5" },
  s: { active: "#19973C1A", activeTxt: "#19973C" }
};
let C = { ...BASE, ...THEME.m };
const setTheme = (site) => { C = { ...BASE, ...(THEME[site] || THEME.m) }; };

/* 상태 칩 컬러 - 디자인 가이드 State 컬러 */
const SC = {
  "예정": { b: "#E9ECF3",    t: "#6B7280" },   /* 회색 */
  "진행": { b: "#0C8CE91A", t: "#0C8CE9" },   /* state2 */
  "지연": { b: "#F36D001A", t: "#F36D00" },   /* state4 */
  "완료": { b: "#31BB481A", t: "#31BB48" },   /* state3 */
};

const INIT_USER_GROUPS = [
  { id: "GRP001", nm: "IT운영팀",   regDt: "2026-01-05" },
  { id: "GRP002", nm: "재무팀",     regDt: "2026-01-05" },
  { id: "GRP003", nm: "정보보안팀", regDt: "2026-01-10" },
  { id: "GRP004", nm: "경영지원팀", regDt: "2026-01-10" },
  { id: "GRP005", nm: "데이터팀",   regDt: "2026-01-15" },
];
const USERS = [
  { userId: "admin",    userNm: "김시스템",  userRole: "시스템관리자", email: "admin@cs.kr",    phone: "010-1234-5678", useYn: "Y", lastLoginDt: "2026-02-10 09:00", groupId: "GRP001" },
  { userId: "orgadmin", userNm: "이기관",    userRole: "기관관리자",   email: "org@cs.kr",      phone: "010-2345-6789", useYn: "Y", lastLoginDt: "2026-02-10 08:30", groupId: "GRP001" },
  { userId: "maintmgr", userNm: "박유지보수", userRole: "유지보수총괄", email: "maint@cs.kr",   phone: "010-3456-7890", useYn: "Y", lastLoginDt: "2026-02-09 17:00", groupId: "GRP003" },
  { userId: "user01",   userNm: "최점검",    userRole: "사용자",       email: "user01@cs.kr",   phone: "010-4567-8901", useYn: "Y", lastLoginDt: "2026-02-10 08:00", groupId: "GRP002" },
  { userId: "user02",   userNm: "정담당",    userRole: "사용자",       email: "user02@cs.kr",   phone: "010-5678-9012", useYn: "Y", groupId: "GRP004" },
  { userId: "user03",   userNm: "한미사용",  userRole: "사용자",       email: "user03@cs.kr",   useYn: "N" },
];
const SYS = [
  { id: "SYS001", nm: "고객관리시스템", type: "업무", org: "IT운영팀", useYn: "Y", mem: 8, res: 42 },
  { id: "SYS002", nm: "인사관리시스템", type: "업무", org: "IT운영팀", useYn: "Y", mem: 5, res: 28 },
  { id: "SYS003", nm: "전자결재시스템", type: "서비스", org: "경영지원팀", useYn: "Y", mem: 6, res: 35 },
  { id: "SYS004", nm: "재무회계시스템", type: "업무", org: "재무팀", useYn: "Y", mem: 4, res: 30 },
  { id: "SYS005", nm: "물류관리시스템", type: "업무", org: "물류팀", useYn: "Y", mem: 5, res: 32 },
  { id: "SYS006", nm: "홈페이지", type: "서비스", org: "홍보팀", useYn: "Y", mem: 3, res: 22 },
  { id: "SYS007", nm: "메일시스템", type: "서비스", org: "IT운영팀", useYn: "Y", mem: 4, res: 25 },
  { id: "SYS008", nm: "보안관제시스템", type: "보안", org: "정보보안팀", useYn: "Y", mem: 6, res: 38 },
  { id: "SYS009", nm: "빅데이터분석시스템", type: "분석", org: "데이터팀", useYn: "N", mem: 3, res: 20 },
  { id: "SHARED", nm: "공유자원", type: "기타", org: "IT운영팀", useYn: "Y", mem: 4, res: 28 },
];
const _sysMap = { SYS001: "고객관리시스템", SYS002: "인사관리시스템", SYS003: "전자결재시스템", SYS004: "재무회계시스템", SYS005: "물류관리시스템", SYS006: "홈페이지", SYS007: "메일시스템", SYS008: "보안관제시스템", SYS009: "빅데이터분석시스템", SHARED: "공유자원" };
const _sIds = ["SYS001","SYS002","SYS003","SYS004","SYS005","SYS006","SYS007","SYS008","SYS009","SHARED"];
const _mids = ["서버","WEB","WAS","DBMS","네트워크","보안","스토리지","백업","서비스","유효성"];
const _smalls = { "서버":["Linux","Windows","AIX"], "WEB":["Apache","Nginx","IIS"], "WAS":["Tomcat","WebLogic","JEUS"], "DBMS":["MySQL","PostgreSQL","Oracle","MariaDB"], "네트워크":["L2 Switch","L3 Switch","Router","Firewall"], "보안":["WAF","IPS","IDS"], "스토리지":["NAS","SAN"], "백업":["Backup Server","Tape"], "서비스":["URL 모니터링","API 모니터링","포트 모니터링"], "유효성":["인증서","라이선스","계정"] };
const _oss = ["CentOS 7","Ubuntu 22.04","RHEL 8","Windows Server 2022","Rocky Linux 9",""];
const _pfx = { SYS001:"CRM", SYS002:"HR", SYS003:"GW", SYS004:"FIN", SYS005:"LOG", SYS006:"WEB", SYS007:"MAIL", SYS008:"SEC", SYS009:"BDA", SHARED:"SHR" };
const _midCode = { "서버":"SVR","WEB":"WEB","WAS":"WAS","DBMS":"DB","네트워크":"NET","보안":"SEC","스토리지":"STG","백업":"BKP","서비스":"SVC","유효성":"VLD" };
const RES = (() => {
  const arr = []; let id = 1;
  _sIds.forEach(sid => {
    const cnt = sid === "SHARED" ? 28 : [42,28,35,30,32,22,25,38,20][_sIds.indexOf(sid)];
    for (let i = 0; i < cnt; i++) {
      const mi = _mids[i % _mids.length], sm = _smalls[mi][(i >> 3) % _smalls[mi].length];
      const seq = String(i + 1).padStart(2, "0");
      arr.push({ id: id++, sysId: sid, sysNm: _sysMap[sid], nm: `${_pfx[sid]}-${_midCode[mi]}-${seq}`, mid: mi, small: sm, st: id % 15 === 0 ? "미사용" : "사용", ip: `${10 + _sIds.indexOf(sid)}.${100 + (i >> 4)}.${(i % 16) * 10 + 1}.${(i % 254) + 1}`, os: mi === "서버" || mi === "WAS" ? _oss[i % _oss.length] : "", resourceId: `${_pfx[sid]}-${_midCode[mi]}-${seq}`, inspectors: [["user01","user02","admin"][i % 3]] });
    }
  });
  return arr;
})();
const _clNms = ["서버 상태점검표","WEB 상태점검표","WAS 상태점검표","DBMS 상태점검표","네트워크 상태점검표","보안 상태점검표","스토리지 상태점검표","백업 상태점검표"];
const _kinds = ["상태점검","상태점검","유효성점검","상태점검","서비스점검","상태점검","유효성점검","서비스점검"];
const _sts = ["예정","진행","지연","완료"];
const _insps = ["최점검","정담당","박유지보수","최점검","정담당","최점검","정담당","박유지보수"];
const _subKinds = { "상태점검": ["서버상태","네트워크상태","보안상태","스토리지상태","WEB상태","WAS상태","DBMS상태","백업상태"], "유효성점검": ["계정유효성","설정유효성","서비스유효성"], "서비스점검": ["서비스가용성","응답시간","연결상태"] };
const _autoRes = ["정상","정상","정상","비정상","정상","정상","정상","비정상","오류","정상"];
const _eyeRes = ["정상","정상","비정상","정상","정상","정상","비정상","정상","-","정상"];
const DI = (() => {
  const arr = [];
  for (let i = 0; i < 40; i++) {
    const si = i % 10, res = RES[i * 7 % RES.length];
    const day = String(1 + (i % 28)).padStart(2, "0");
    const st = _sts[i % 4];
    const kind = _kinds[i % 8];
    const subs = _subKinds[kind] || [];
    const sub = subs[i % subs.length] || "";
    const isComp = st === "완료";
    arr.push({
      id: i + 1,
      sysNm: _sysMap[_sIds[si]],
      resNm: res.nm,
      mid: res.mid,
      clNm: _clNms[i % 8],
      kind,
      sub,
      due: `2026-02-${day}`,
      st,
      insp: _insps[i % 8],
      execDt: isComp ? `2026-02-${day} ${String(9 + (i % 8)).padStart(2,"0")}:${String(i % 60).padStart(2,"0")}` : "-",
      summary: isComp ? ["CPU 정상","메모리 정상","디스크 정상","서비스 정상"][i % 4] : "-",
      autoRes: isComp ? _autoRes[i % _autoRes.length] : "-",
      eyeRes: isComp ? _eyeRes[i % _eyeRes.length] : "-",
      submitDt: isComp ? `2026-02-${day} ${String(10 + (i % 8)).padStart(2,"0")}:30` : "-",
      memo: isComp && i % 5 === 0 ? "특이사항 없음" : "",
      hasFile: isComp && i % 3 === 0,
      recheck: isComp && i % 7 === 0 ? "Y" : "N",
    });
  }
  return arr;
})();
const SI = [
  { id: 1, sysNm: "고객관리시스템", title: "2026년 상반기 이중화 점검", kind: "이중화점검", due: "2026-02-28", st: "진행", reg: "2026-02-01", regUser: "김시스템", resources: ["CRM-SVR-01","CRM-SVR-02"], insp: "최점검", planFile: true, purpose: "서버 이중화 절체 테스트", content: "주요 서버 이중화 구성 점검", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 2, sysNm: "고객관리시스템", title: "성능 개선 점검", kind: "성능점검", due: "2026-03-15", st: "예정", reg: "2026-02-05", regUser: "이기관", resources: ["CRM-WEB-01"], insp: "정담당", planFile: false, purpose: "성능 병목 구간 분석", content: "CPU/메모리 부하 테스트", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 3, sysNm: "인사관리시스템", title: "업무집중기간 사전점검", kind: "업무집중기간점검", due: "2026-03-01", st: "예정", reg: "2026-02-08", regUser: "이기관", resources: ["HR-SVR-01","HR-DB-01"], insp: "박유지보수", planFile: true, purpose: "업무집중기간 안정성 확보", content: "인사시스템 전반 점검", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 4, sysNm: "전자결재시스템", title: "전자결재 오프라인 점검", kind: "오프라인점검", due: "2026-02-20", st: "완료", reg: "2026-02-01", regUser: "김시스템", resources: ["GW-SVR-01"], insp: "최점검", planFile: true, purpose: "결재시스템 오프라인 테스트", content: "오프라인 절체 후 서비스 복구 확인", execDt: "2026-02-20", submitDt: "2026-02-20 17:30", resultContent: "정상 복구 확인. 복구 소요시간 12분.", resultFile: true, recheck: "N" },
  { id: 5, sysNm: "재무회계시스템", title: "회계 마감기간 성능점검", kind: "성능점검", due: "2026-02-25", st: "진행", reg: "2026-02-10", regUser: "이기관", resources: ["FIN-DB-01","FIN-WAS-01"], insp: "정담당", planFile: true, purpose: "마감기간 성능 이슈 사전 예방", content: "DB 쿼리 성능 및 WAS 부하 테스트", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 6, sysNm: "보안관제시스템", title: "보안장비 이중화 절체 테스트", kind: "이중화점검", due: "2026-03-10", st: "예정", reg: "2026-02-11", regUser: "김시스템", resources: ["SEC-NET-01","SEC-NET-02"], insp: "박유지보수", planFile: false, purpose: "보안장비 이중화 검증", content: "방화벽 절체 테스트", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 7, sysNm: "홈페이지", title: "홈페이지 대외 서비스 점검", kind: "오프라인점검", due: "2026-02-15", st: "완료", reg: "2026-02-01", regUser: "이기관", resources: ["WEB-WEB-01"], insp: "최점검", planFile: true, purpose: "대외 서비스 점검", content: "홈페이지 전체 페이지 점검", execDt: "2026-02-15", submitDt: "2026-02-15 16:00", resultContent: "전체 페이지 정상. 일부 이미지 깨짐 확인.", resultFile: true, recheck: "Y" },
  { id: 8, sysNm: "물류관리시스템", title: "물류 업무집중기간 점검", kind: "업무집중기간점검", due: "2026-03-20", st: "예정", reg: "2026-02-09", regUser: "박유지보수", resources: ["LOG-SVR-01","LOG-WAS-01"], insp: "정담당", planFile: false, purpose: "물류 피크기간 안정성 확보", content: "물류 처리 집중 구간 점검", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 9, sysNm: "메일시스템", title: "메일서버 성능 부하 테스트", kind: "성능점검", due: "2026-02-18", st: "지연", reg: "2026-02-03", regUser: "김시스템", resources: ["MAIL-SVR-01"], insp: "박유지보수", planFile: true, purpose: "메일 발송 지연 원인 분석", content: "메일 큐 및 SMTP 성능 테스트", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 10, sysNm: "공유자원", title: "네트워크 이중화 절체 점검", kind: "이중화점검", due: "2026-02-22", st: "진행", reg: "2026-02-05", regUser: "이기관", resources: ["SHR-NET-01","SHR-NET-02"], insp: "최점검", planFile: true, purpose: "네트워크 이중화 검증", content: "L3 스위치 절체 테스트", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 11, sysNm: "빅데이터분석시스템", title: "BDA 스토리지 성능 점검", kind: "성능점검", due: "2026-03-05", st: "예정", reg: "2026-02-10", regUser: "김시스템", resources: ["BDA-STG-01"], insp: "정담당", planFile: false, purpose: "스토리지 I/O 성능 검증", content: "대용량 데이터 처리 성능 점검", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
  { id: 12, sysNm: "고객관리시스템", title: "CRM DR 훈련 오프라인 점검", kind: "오프라인점검", due: "2026-03-25", st: "예정", reg: "2026-02-11", regUser: "김시스템", resources: ["CRM-SVR-01","CRM-DB-01"], insp: "박유지보수", planFile: true, purpose: "DR 훈련 목적 오프라인 점검", content: "재해복구 시나리오 기반 점검", execDt: "-", submitDt: "-", resultContent: "-", resultFile: false, recheck: "N" },
];
const SCH = [
  { id: 1, sysNm: "고객관리시스템", nm: "CRM 서버 일간점검", clNm: "서버 상태점검표", freq: "매일", autoTime: "06:00", reportTime: "18:00", useYn: "Y", resCnt: 5, next: "2026-02-11 09:00" },
  { id: 2, sysNm: "고객관리시스템", nm: "CRM WEB 주간점검", clNm: "WEB 상태점검표", freq: "매주 월,수,금", autoTime: "07:00", reportTime: "17:00", useYn: "Y", resCnt: 3, next: "2026-02-12 10:00" },
  { id: 3, sysNm: "고객관리시스템", nm: "CRM DB 월간점검", clNm: "DBMS 상태점검표", freq: "매월 1일", autoTime: "05:00", reportTime: "18:00", useYn: "Y", resCnt: 2, next: "2026-03-01 09:00" },
  { id: 4, sysNm: "인사관리시스템", nm: "HR 서버 일간점검", clNm: "서버 상태점검표", freq: "매일", autoTime: "06:00", reportTime: "18:00", useYn: "Y", resCnt: 4, next: "2026-02-11 09:00" },
  { id: 5, sysNm: "전자결재시스템", nm: "GW WAS 주간점검", clNm: "WAS 상태점검표", freq: "매주 화,목", autoTime: "06:30", reportTime: "17:30", useYn: "Y", resCnt: 3, next: "2026-02-13 09:00" },
  { id: 6, sysNm: "재무회계시스템", nm: "FIN DB 월간점검", clNm: "DBMS 상태점검표", freq: "매월 15일", autoTime: "05:00", reportTime: "18:00", useYn: "Y", resCnt: 2, next: "2026-02-15 09:00" },
  { id: 7, sysNm: "물류관리시스템", nm: "LOG 서버 주간점검", clNm: "서버 상태점검표", freq: "매주 월,금", autoTime: "06:00", reportTime: "17:00", useYn: "Y", resCnt: 4, next: "2026-02-14 09:00" },
  { id: 8, sysNm: "홈페이지", nm: "WEB 서비스 일간점검", clNm: "WEB 상태점검표", freq: "매일", autoTime: "05:30", reportTime: "18:00", useYn: "Y", resCnt: 3, next: "2026-02-11 08:00" },
  { id: 9, sysNm: "보안관제시스템", nm: "SEC 보안 월간점검", clNm: "보안 상태점검표", freq: "매월 1일", autoTime: "06:00", reportTime: "18:00", useYn: "Y", resCnt: 5, next: "2026-03-01 09:00" },
  { id: 10, sysNm: "메일시스템", nm: "MAIL WAS 주간점검", clNm: "WAS 상태점검표", freq: "매주 수", autoTime: "07:00", reportTime: "17:00", useYn: "Y", resCnt: 2, next: "2026-02-12 10:00" },
  { id: 11, sysNm: "공유자원", nm: "네트워크 장비 월간점검", clNm: "네트워크 상태점검표", freq: "매월 10일", autoTime: "06:00", reportTime: "18:00", useYn: "Y", resCnt: 6, next: "2026-03-10 09:00" },
  { id: 12, sysNm: "빅데이터분석시스템", nm: "BDA 스토리지 점검", clNm: "스토리지 상태점검표", freq: "매월 1일", autoTime: "06:00", reportTime: "18:00", useYn: "N", resCnt: 3, next: "—" },
];
const CL = [
  { id: 1, nm: "서버 상태점검표", type: "일상점검", kind: "상태점검", sub: "서버", useYn: "Y", items: 6, sch: 2 },
  { id: 2, nm: "WEB 상태점검표", type: "일상점검", kind: "상태점검", sub: "WEB", useYn: "Y", items: 4, sch: 1 },
  { id: 3, nm: "DBMS 상태점검표", type: "일상점검", kind: "상태점검", sub: "DBMS", useYn: "Y", items: 5, sch: 1 },
  { id: 4, nm: "서비스 유효성 점검표", type: "일상점검", kind: "유효성점검", sub: "", useYn: "Y", items: 3, sch: 0 },
];
const VC = [
  { id: "VC001", nm: "CPU 사용률 점검", agent: "PROMETHEUS", val: "< 80%", useYn: "Y" },
  { id: "VC002", nm: "메모리 사용률 점검", agent: "PROMETHEUS", val: "< 85%", useYn: "Y" },
  { id: "VC003", nm: "디스크 사용률 점검", agent: "PROMETHEUS", val: "< 90%", useYn: "Y" },
  { id: "VC004", nm: "서비스 포트 점검", agent: "SSH", val: "OPEN", useYn: "Y" },
  { id: "VC005", nm: "로그 에러 점검", agent: "LOKI", val: "0", useYn: "Y" },
  { id: "VC006", nm: "서버 접속 확인", agent: "SSH", val: "SUCCESS", useYn: "Y" },
  { id: "VC007", nm: "보안패치 확인", agent: "육안검수", val: "", useYn: "Y" },
];
const NT = [
  { id: 1, title: "2026년 1분기 정기점검 일정 안내", views: 145, user: "김시스템", dt: "2026-01-10" },
  { id: 2, title: "시스템 업데이트 안내 (v2.1)", views: 98, user: "김시스템", dt: "2026-01-15" },
  { id: 3, title: "점검표 양식 변경 안내", views: 72, user: "이기관", dt: "2026-01-20" },
  { id: 4, title: "보안관제시스템 긴급 패치 안내", views: 210, user: "김시스템", dt: "2026-01-25" },
  { id: 5, title: "2월 휴무일 설정 완료 안내", views: 88, user: "이기관", dt: "2026-02-01" },
  { id: 6, title: "점검자 배정 기준 변경 안내", views: 56, user: "박유지보수", dt: "2026-02-03" },
  { id: 7, title: "네트워크 장비 교체 일정", views: 134, user: "김시스템", dt: "2026-02-05" },
  { id: 8, title: "자동점검 코어 버전 업데이트", views: 67, user: "김시스템", dt: "2026-02-07" },
  { id: 9, title: "업무집중기간 점검 협조 요청", views: 92, user: "이기관", dt: "2026-02-08" },
  { id: 10, title: "라이선스 갱신 안내 (2026년)", views: 43, user: "김시스템", dt: "2026-02-10" },
  { id: 11, title: "신규 정보시스템 등록 가이드", views: 31, user: "김시스템", dt: "2026-02-11" },
];

/* ── SVG Icons ── */
const Ic = ({ n, s = 16, c = "currentColor" }) => {
  const d = {
    dash: "M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z",
    db: "M12 2C6.5 2 3 3.3 3 5v14c0 1.7 3.5 3 9 3s9-1.3 9-3V5c0-1.7-3.5-3-9-3zM3 12c0 1.7 3.5 3 9 3s9-1.3 9-3",
    search: "M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z",
    check: "M22 11.08V12a10 10 0 11-5.93-9.14M22 4L12 14.01 9 11.01",
    alert: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 8v4M12 16h.01",
    bell: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0",
    gear: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z",
    users: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 3a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75",
    cal: "M3 4h18v18H3zM16 2v4M8 2v4M3 10h18",
    menu: "M3 12h18M3 6h18M3 18h18",
    out: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
    down: "M6 9l6 6 6-6",
    right: "M9 18l6-6-6-6",
    file: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8zM14 2v6h6M16 13H8M16 17H8",
    server: "M2 2h20v8H2zM2 14h20v8H2zM6 6h.01M6 18h.01",
    clock: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 6v6l4 2",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
    info: "M12 2a10 10 0 100 20 10 10 0 000-20zM12 16v-4M12 8h.01",
  };
  return <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d[n] || d.info} /></svg>;
};

/* ── UI Components ── */
/* state-chip: 디자인 가이드 상태 칩 */
const Badge = ({ status }) => {
  const s = SC[status] || { b: "#E9ECF3", t: "#929292" };
  return <span style={{ padding: "3px 12px", borderRadius: 50, fontSize: 12, fontWeight: 600, background: s.b, color: s.t, display: "inline-flex", alignItems: "center", whiteSpace: "nowrap" }}>{status}</span>;
};
const YnBadge = ({ v }) => {
  const isY = v === "Y" || v === "사용";
  return <span style={{ padding: "3px 12px", borderRadius: 50, fontSize: 12, fontWeight: 600, background: isY ? "#31BB481A" : "#8C939D1A", color: isY ? "#31BB48" : "#8C939D", display: "inline-flex", alignItems: "center" }}>{isY ? "사용" : "미사용"}</span>;
};
const RoleBadge = ({ v }) => {
  const rc = { "시스템관리자": { b: "#339CD51A", t: "#339CD5" }, "기관관리자": { b: "#31BB481A", t: "#31BB48" }, "유지보수총괄": { b: "#F36D001A", t: "#F36D00" }, "사용자": { b: "#E9ECF3", t: "#929292" } };
  const style = rc[v] || { b: "#E9ECF3", t: "#929292" };
  return <span style={{ padding: "3px 8px", borderRadius: 4, fontSize: 11, fontWeight: 500, background: style.b, color: style.t }}>{v}</span>;
};
/* btn: 디자인 가이드 버튼 */
const Btn = ({ children, primary, small, onClick, style: cs }) => <button onClick={onClick} style={{ display: "inline-flex", alignItems: "center", gap: 5, cursor: "pointer", border: primary ? "none" : `1px solid ${C.brdD}`, borderRadius: 4, padding: small ? "5px 12px" : "8px 20px", fontSize: small ? 12 : 13, fontWeight: 500, background: primary ? C.sec : C.white, color: primary ? C.white : C.txt, lineHeight: 1.4, transition: "all .3s", ...cs }}>{children}</button>;
/* SecBtn: 테이블 우측 상단 버튼 */
const SecBtnO = ({ children, onClick }) => <button onClick={onClick} style={{ height: 36, padding: "4px 12px", borderRadius: 4, fontSize: 14, fontWeight: 500, background: "#fff", color: C.txt, border: `1px solid ${C.brd}`, cursor: "pointer", fontFamily: "inherit", transition: "all .3s" }}
  onMouseEnter={e => e.currentTarget.style.background = C.bg} onMouseLeave={e => e.currentTarget.style.background = "#fff"}>{children}</button>;
const SecBtnP = ({ children, onClick }) => <button onClick={onClick} style={{ height: 36, padding: "4px 12px", borderRadius: 4, fontSize: 14, fontWeight: 500, background: C.sec, color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit", transition: "all .3s" }}
  onMouseEnter={e => e.currentTarget.style.background = "#3a6cc8"} onMouseLeave={e => e.currentTarget.style.background = C.sec}>{children}</button>;
const Card = ({ title, extra, children, style: cs, onClick }) => (
  <div style={{ background: C.white, borderRadius: 8, border: `1px solid ${C.brd}`, ...cs }}>
    {(title || extra) && <div style={{ padding: "14px 20px", borderBottom: `1px solid ${C.brd}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}><span onClick={onClick} style={{ fontSize: 15, fontWeight: 600, color: C.txH, cursor: onClick ? "pointer" : "inherit" }}>{title}{onClick && <span style={{fontSize:11,color:C.txL,fontWeight:400,marginLeft:6}}>→</span>}</span>{extra}</div>}
    <div style={{ padding: 20, ...(cs?.flexDirection === "column" ? { flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflowY: "auto" } : {}) }}>{children}</div>
  </div>
);
const Stat = ({ label, value, color, icon, onClick }) => (
  <div onClick={onClick} style={{ background: C.white, borderRadius: 8, border: `1px solid ${C.brd}`, padding: "20px 24px", flex: 1, minWidth: 140, cursor: onClick ? "pointer" : "default", transition: "box-shadow .2s" }} onMouseEnter={e => { if(onClick) e.currentTarget.style.boxShadow="0 2px 12px rgba(0,0,0,.1)"; }} onMouseLeave={e => e.currentTarget.style.boxShadow=""}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 13, color: C.txL, marginBottom: 8, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 700, color: color || C.txH }}>{value}</div>
      </div>
      <div style={{ width: 46, height: 46, borderRadius: 10, background: (color || C.pri) + "18", display: "flex", alignItems: "center", justifyContent: "center" }}><Ic n={icon} s={22} c={color || C.pri} /></div>
    </div>
  </div>
);
/* PH: 페이지 헤더 + 브레드크럼 (title-layout) */
const PH = ({ title, bc, extra }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 600, color: C.txH, lineHeight: "32px" }}>{title}</h1>
      <div style={{ width: 24, height: 24, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.brdD, transition: "all .3s" }}
        onMouseEnter={e => e.currentTarget.style.color = "#f5c518"} onMouseLeave={e => e.currentTarget.style.color = C.brdD}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 1l2.1 4.2 4.7.7-3.4 3.3.8 4.6L8 11.6 3.8 13.8l.8-4.6L1.2 5.9l4.7-.7L8 1z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
      </div>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {extra}
      {bc && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.txL }}>
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><path d="M2 6l6-4 6 4v7a1 1 0 01-1 1H3a1 1 0 01-1-1V6z" stroke="currentColor" strokeWidth="1.3"/><path d="M6 14V9h4v5" stroke="currentColor" strokeWidth="1.3"/></svg>
        {bc.split(" > ").map((b, i, arr) => <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {i > 0 && <span style={{ color: C.txX }}>›</span>}
          <span style={{ color: i === arr.length - 1 ? C.txS : C.txL }}>{b}</span>
        </span>)}
      </div>}
    </div>
  </div>
);
const SB = ({ ph = "검색어를 입력하세요" }) => {
  const [v, setV] = useState("");
  return <div style={{ width: "100%", border: `1px solid ${C.brd}`, background: C.bg, borderRadius: 6, padding: "16px 12px", display: "flex", gap: 8, marginBottom: 16, alignItems: "stretch" }}>
    <div style={{ display: "flex", flex: 1, gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: C.txS }}>검색</span>
        <input value={v} onChange={e => setV(e.target.value)} placeholder={ph} style={{ padding: "6px 12px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 15, outline: "none", color: C.txt, background: "#fff", minHeight: 36, minWidth: 240, fontFamily: "inherit" }} />
      </div>
    </div>
    <div style={{ display: "flex", gap: 6, alignItems: "stretch" }}>
      <button style={{ background: "#fff", border: `1px solid ${C.sec}`, color: C.sec, borderRadius: 4, padding: "0 24px", fontSize: 15, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", minWidth: 60, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s" }}
              onMouseEnter={e => { e.currentTarget.style.background = C.sec; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = C.sec; }}>검색</button>
      <button onClick={() => setV("")} title="검색 초기화" style={{ background: C.priL, border: `1px solid ${C.pri}40`, borderRadius: 4, padding: "0 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", minWidth: 40 }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 2v4h-4" stroke={C.pri} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.5 10a6 6 0 11-1.3-6.3L14 6" stroke={C.pri} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  </div>;
};
/* Tbl: 디자인 가이드 data-table + sec-title 통합 */
const Tbl = ({ cols, data, onRow, pageSize = 10, noPaging, secTitle, secCount, secButtons }) => {
  const [pg, setPg] = useState(1);
  const total = data.length;
  const maxPg = Math.max(1, Math.ceil(total / pageSize));
  useEffect(() => { setPg(1); }, [data.length]);
  const rows = noPaging ? data : data.slice((pg - 1) * pageSize, pg * pageSize);
  const pBtn = (icon, disabled, onClick) => <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{ width: 28, height: 28, background: "none", border: "none", cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, color: disabled ? C.txX : C.txS, padding: 0 }}>{icon}</button>;
  const pNum = (n) => <button key={n} onClick={() => setPg(n)} style={{ minWidth: 28, height: 28, padding: "0 6px", background: pg === n ? C.sec : "none", border: "none", cursor: "pointer", borderRadius: 4, fontSize: 14, fontWeight: pg === n ? 600 : 400, color: pg === n ? C.white : C.txS, fontFamily: "inherit" }}>{n}</button>;
  const pages = () => {
    const ps = [];
    let s = Math.max(1, pg - 2), e = Math.min(maxPg, pg + 2);
    if (e - s < 4) { s = Math.max(1, e - 4); e = Math.min(maxPg, s + 4); }
    for (let i = s; i <= e; i++) ps.push(pNum(i));
    return ps;
  };
  const ArrowIcon = ({ d }) => <svg width="8" height="12" viewBox="0 0 8 12" fill="none"><path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  return <div>
    {(secTitle || secButtons) && <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingTop: 38, paddingBottom: 8, borderBottom: `1px solid ${C.brdD}`, marginBottom: 0 }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
        {secTitle && <span style={{ fontSize: 18, fontWeight: 600, color: C.txH }}>{secTitle}</span>}
        {secCount != null && <span style={{ fontSize: 12, color: C.txL }}>{secCount}건</span>}
      </div>
      {secButtons && <div style={{ display: "flex", gap: 4 }}>{secButtons}</div>}
    </div>}
    <div style={{ overflowX: "auto" }}>
      <table style={{ minWidth: "100%", width: "max-content", borderCollapse: "collapse", fontSize: 15, borderBottom: `1px solid ${C.brd}` }}>
        <thead><tr style={{ borderTop: `1px solid ${C.txH}` }}>{cols.map((c, i) => <th key={i} style={{ padding: "9px 12px", borderBottom: `1px solid ${C.brdD}`, textAlign: c.align || "center", fontWeight: 400, color: C.txL, fontSize: 14, whiteSpace: "nowrap", background: C.white, verticalAlign: "middle", ...(c.w ? {width: c.w} : {}), ...(c.mw ? {minWidth: c.mw} : {}) }}>{c.t}</th>)}</tr></thead>
        <tbody>
          {rows.length === 0 ? <tr><td colSpan={cols.length} style={{ padding: 48, textAlign: "center", color: C.txL, fontSize: 14 }}>데이터가 없습니다.</td></tr> :
            rows.map((r, ri) => <tr key={ri} onClick={() => onRow?.(r)} style={{ cursor: onRow ? "pointer" : "default" }}
              onMouseEnter={e => e.currentTarget.style.background = C.secL} onMouseLeave={e => e.currentTarget.style.background = ""}>{cols.map((c, ci) => <td key={ci} style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, whiteSpace: "nowrap", textAlign: c.align || "center", color: C.txt, fontSize: 15, verticalAlign: "middle", ...(c.w ? {width: c.w} : {}), ...(c.mw ? {minWidth: c.mw} : {}) }}>{c.r ? c.r(r[c.k], r) : (r[c.k] ?? "—")}</td>)}</tr>)}
        </tbody>
      </table>
    </div>
    {!noPaging && total > pageSize && <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
        <div style={{ display: "flex", gap: 2 }}>
          {pBtn(<ArrowIcon d="M6.5 1L1.5 6L6.5 11" />, pg === 1, () => setPg(1))}
          {pBtn(<ArrowIcon d="M6.5 1L1.5 6L6.5 11" />, pg === 1, () => setPg(pg - 1))}
        </div>
        <div style={{ display: "flex", gap: 2 }}>{pages()}</div>
        <div style={{ display: "flex", gap: 2 }}>
          {pBtn(<ArrowIcon d="M1.5 1L6.5 6L1.5 11" />, pg === maxPg, () => setPg(pg + 1))}
          {pBtn(<ArrowIcon d="M1.5 1L6.5 6L1.5 11" />, pg === maxPg, () => setPg(maxPg))}
        </div>
      </div>
    </div>}
  </div>;
};

/* GuiPag: 가이드 스타일 페이지네이션 */
const GuiPag = ({ page, totalPages, setPage }) => {
  if (totalPages <= 1) return null;
  const ArrowIcon = ({ d }) => <svg width="8" height="12" viewBox="0 0 8 12" fill="none"><path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
  const pb = (icon, disabled, onClick) => <button onClick={disabled ? undefined : onClick} disabled={disabled} style={{ width: 28, height: 28, background: "none", border: "none", cursor: disabled ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, color: disabled ? C.txX : C.txS, padding: 0 }}>{icon}</button>;
  const ps = [];
  let s = Math.max(1, page - 2), e = Math.min(totalPages, page + 2);
  if (e - s < 4) { s = Math.max(1, e - 4); e = Math.min(totalPages, s + 4); }
  for (let i = s; i <= e; i++) ps.push(i);
  return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 0" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div style={{ display: "flex", gap: 2 }}>
        {pb(<ArrowIcon d="M6.5 1L1.5 6L6.5 11" />, page === 1, () => setPage(1))}
        {pb(<ArrowIcon d="M6.5 1L1.5 6L6.5 11" />, page === 1, () => setPage(page - 1))}
      </div>
      <div style={{ display: "flex", gap: 2 }}>
        {ps.map(n => <button key={n} onClick={() => setPage(n)} style={{ minWidth: 28, height: 28, padding: "0 6px", background: page === n ? C.sec : "none", border: "none", cursor: "pointer", borderRadius: 4, fontSize: 14, fontWeight: page === n ? 600 : 400, color: page === n ? "#fff" : C.txS, fontFamily: "inherit" }}>{n}</button>)}
      </div>
      <div style={{ display: "flex", gap: 2 }}>
        {pb(<ArrowIcon d="M1.5 1L6.5 6L1.5 11" />, page === totalPages, () => setPage(page + 1))}
        {pb(<ArrowIcon d="M1.5 1L6.5 6L1.5 11" />, page === totalPages, () => setPage(totalPages))}
      </div>
    </div>
  </div>;
};

/* ── Modal & Form Components ── */
const Modal = ({ open, onClose, title, width = 580, children }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)" }} />
      <div style={{ position: "relative", background: C.white, borderRadius: 8, width, maxWidth: "92vw", maxHeight: "88vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,.2)", animation: "modalIn .2s ease" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.brd}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.txH }}>{title}</span>
          <div onClick={onClose} style={{ width: 32, height: 32, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.txL, fontSize: 18 }}
            onMouseEnter={e => e.currentTarget.style.background = C.bg} onMouseLeave={e => e.currentTarget.style.background = ""}>✕</div>
        </div>
        <div style={{ padding: "22px 24px", overflowY: "auto", flex: 1 }}>{children}</div>
      </div>
      <style>{`@keyframes modalIn { from { opacity:0; transform:translateY(12px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
    </div>
  );
};

const FormRow = ({ label, required, children, half }) => (
  <div style={{ marginBottom: 14, display: half ? "inline-flex" : "flex", flexDirection: "column", width: half ? "calc(50% - 6px)" : "100%", marginRight: half ? 12 : 0, verticalAlign: "top" }}>
    <label style={{ fontSize: 13, fontWeight: 500, color: C.txL, marginBottom: 6, display: "flex", alignItems: "center", gap: 3 }}>
      {label}{required && <span style={{ color: C.red, fontSize: 11 }}>*</span>}
    </label>
    {children}
  </div>
);
/* 디자인 가이드 input 스타일 */
const fInput = { width: "100%", padding: "9px 14px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, outline: "none", boxSizing: "border-box", background: "#fff", color: C.txt, transition: "all .3s" };
const SecTitle = ({ label, primary }) => (
  <div style={{ fontSize: 14, fontWeight: 700, color: C.txH, marginBottom: 14, paddingBottom: 8,
    borderBottom: `2px solid ${primary ? C.sec : C.brd}`, display: "inline-block", minWidth: 60 }}>{label}</div>
);
const PanelDeleteBtn = ({ onClick }) => (
  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16, marginTop: -6 }}>
    <button onClick={onClick} style={{ padding: "6px 14px", fontSize: 12, fontWeight: 600,
      border: `1px solid ${C.red}30`, borderRadius: 4, background: `${C.red}0D`, color: C.red, cursor: "pointer" }}>삭제</button>
  </div>
);
const PanelFooter = ({ onCancel, onSave, saveLabel = "저장", extraLeft }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
    paddingTop: 16, marginTop: 8, borderTop: `1px solid ${C.brd}` }}>
    <div>{extraLeft}</div>
    <div style={{ display: "flex", gap: 8 }}>
      <Btn onClick={onCancel}>취소</Btn>
      <Btn primary onClick={onSave}>{saveLabel}</Btn>
    </div>
  </div>
);
const _chevron = "url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iNiIgdmlld0JveD0iMCAwIDEwIDYiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTTEgMWw0IDQgNC00IiBzdHJva2U9IiM5MjkyOTIiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48L3N2Zz4=\")";
const fSelect = { ...fInput, appearance: "none", WebkitAppearance: "none", MozAppearance: "none", backgroundImage: _chevron, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", paddingRight: 32, cursor: "pointer" };
const fTextarea = { ...fInput, minHeight: 72, resize: "vertical", fontFamily: "inherit" };

/* readOnly select → input으로 렌더링 (사선 패턴 완전 제거) */
const RoSelect = ({ readOnly, value, onChange, style, children, placeholder }) => {
  if (readOnly) {
    let label = String(value || placeholder || "");
    const extract = (ch) => {
      if (!ch) return;
      if (Array.isArray(ch)) { ch.forEach(extract); return; }
      if (ch && ch.props) {
        if (ch.props.value !== undefined && String(ch.props.value) === String(value)) {
          if (typeof ch.props.children === "string") label = ch.props.children;
        }
        if (ch.props.children) extract(ch.props.children);
      }
    };
    try { extract(children); } catch(e) {}
    return React.createElement("input", { readOnly: true, value: label, style: { ...fInput, background: "#F9FAFC", color: C.txt, cursor: "default" } });
  }
  return React.createElement("select", { style: { ...style, backgroundImage: _chevron }, value, onChange }, children);
};

/* ── 정보시스템 추가 레이어 팝업 ── */
const AddSystemModal = ({ open, onClose, onSubmit }) => {
  const emptyForm = { systemNm: "", systemId: "", useYn: "Y", systemType: "", mgmtOrg: "", systemDesc: "", operStartDt: "", operEndDt: "", managerNm: "", managerPhone: "", contractInfo: "", memo: "", members: [] };
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [memberSearch, setMemberSearch] = useState("");

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: undefined })); };
  const mgmtOrgOptions = ["내부", "외부(업체)", "IT운영팀", "경영지원팀", "정보보안팀"];
  const systemTypeOptions = ["업무", "서비스", "솔루션", "기타"];

  const validate = () => {
    const e = {};
    if (!form.systemNm.trim()) e.systemNm = "정보시스템 명은 필수입니다.";
    if (!form.systemId.trim()) e.systemId = "시스템 ID는 필수입니다.";
    else if (!/^[A-Za-z0-9]+$/.test(form.systemId)) e.systemId = "영문/숫자만 입력 가능합니다.";
    else if (form.systemId.length > 20) e.systemId = "20자 이내로 입력해주세요.";
    else if (SYS.some(s => s.id === form.systemId)) e.systemId = "이미 사용 중인 ID입니다.";
    if (!form.systemType) e.systemType = "시스템 유형을 선택해주세요.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => { if (validate()) { onSubmit?.(form); setForm(emptyForm); setErrors({}); setMemberSearch(""); onClose(); } };
  const handleClose = () => { setForm(emptyForm); setErrors({}); setMemberSearch(""); onClose(); };
  const errStyle = (k) => errors[k] ? { borderColor: C.red } : {};

  return (
    <div style={{ display: open ? "block" : "none" }}>
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,.25)", zIndex: 9998 }} onClick={handleClose} />
    <div style={{ position: "fixed", top: 0, right: 0, width: 620, height: "100%", background: "#fff", zIndex: 9999, boxShadow: "-4px 0 20px rgba(0,0,0,.12)", display: "flex", flexDirection: "column", transition: "transform .3s ease" }}>
      <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.brd}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 18, fontWeight: 700, color: C.txH }}>정보시스템 추가</span>
        <button onClick={handleClose} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: C.txL }}>×</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
      {/* 기본 정보 */}
      <div style={{ marginBottom: 20 }}>
        {<SecTitle label="기본 정보" primary />}
        <FormRow label="정보시스템 명" required>
          <input style={{ ...fInput, ...errStyle("systemNm") }} value={form.systemNm} onChange={e => set("systemNm", e.target.value)} placeholder="정보시스템 명을 입력하세요" maxLength={100} />
          {errors.systemNm && <span style={{ fontSize: 11, color: C.red, marginTop: 2 }}>{errors.systemNm}</span>}
        </FormRow>
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="시스템 ID" required half>
            <input style={{ ...fInput, ...errStyle("systemId") }} value={form.systemId} onChange={e => set("systemId", e.target.value.replace(/[^a-zA-Z0-9]/g, ""))} placeholder="영문/숫자, 20자 이내" maxLength={20} />
            {errors.systemId && <span style={{ fontSize: 11, color: C.red, marginTop: 2 }}>{errors.systemId}</span>}
          </FormRow>
          <FormRow label="사용상태" required half>
            <select style={fSelect} value={form.useYn} onChange={e => set("useYn", e.target.value)}>
              <option value="Y">사용</option><option value="N">미사용</option>
            </select>
          </FormRow>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="시스템 유형" required half>
            <select style={{ ...fSelect, ...errStyle("systemType") }} value={form.systemType} onChange={e => set("systemType", e.target.value)}>
              <option value="">선택하세요</option>
              {systemTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            {errors.systemType && <span style={{ fontSize: 11, color: C.red, marginTop: 2 }}>{errors.systemType}</span>}
          </FormRow>
          <FormRow label="관리주체" half>
            <select style={fSelect} value={form.mgmtOrg} onChange={e => set("mgmtOrg", e.target.value)}>
              <option value="">선택하세요</option>
              {mgmtOrgOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </FormRow>
        </div>
        <FormRow label="시스템 설명">
          <textarea style={fTextarea} value={form.systemDesc} onChange={e => set("systemDesc", e.target.value)} placeholder="시스템에 대한 설명을 입력하세요" maxLength={1000} />
        </FormRow>
      </div>

      {/* 운영 정보 */}
      <div style={{ marginBottom: 20 }}>
        {<SecTitle label="운영 정보" />}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="운영시작일" half>
            <input type="date" style={fInput} value={form.operStartDt} onChange={e => set("operStartDt", e.target.value)} />
          </FormRow>
          <FormRow label="종료예정일" half>
            <input type="date" style={fInput} value={form.operEndDt} onChange={e => set("operEndDt", e.target.value)} />
          </FormRow>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="담당자" half>
            <input style={fInput} value={form.managerNm} onChange={e => set("managerNm", e.target.value)} placeholder="담당자 이름" maxLength={50} />
          </FormRow>
          <FormRow label="담당자 연락처" half>
            <input style={fInput} value={form.managerPhone} onChange={e => set("managerPhone", e.target.value)} placeholder="010-0000-0000" maxLength={20} />
          </FormRow>
        </div>
        <FormRow label="계약정보">
          <textarea style={fTextarea} value={form.contractInfo} onChange={e => set("contractInfo", e.target.value)} placeholder="유지보수 계약 정보를 입력하세요" maxLength={500} />
        </FormRow>
        <FormRow label="비고">
          <textarea style={fTextarea} value={form.memo} onChange={e => set("memo", e.target.value)} placeholder="기타 메모 정보" maxLength={500} />
        </FormRow>
      </div>

      {/* 구성원 (MULTI SELECT + 검색) */}
      <div style={{ marginBottom: 20 }}>
        {<SecTitle label="구성원" />}
        {/* 선택된 태그 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8, minHeight: 32 }}>
          {form.members.map(uid => {
            const u = USERS.find(x => x.userId === uid);
            return u ? (
              <span key={uid} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 14, background: C.priL, color: C.priD, fontSize: 12, fontWeight: 500 }}>
                {u.userNm} <span style={{ fontSize: 11, color: C.txL }}>({u.userRole})</span>
                <span onClick={() => set("members", form.members.filter(m => m !== uid))} style={{ cursor: "pointer", marginLeft: 2, fontSize: 14, lineHeight: 1, color: C.txL }}>×</span>
              </span>
            ) : null;
          })}
          {form.members.length === 0 && <span style={{ fontSize: 12, color: C.txL, lineHeight: "32px" }}>구성원이 없습니다. 아래에서 추가하세요.</span>}
        </div>
        {/* 검색 인풋 */}
        <div style={{ position: "relative", marginBottom: 6 }}>
          <input
            style={{ ...fInput, paddingLeft: 30, fontSize: 12, marginBottom: 0 }}
            placeholder="이름, 아이디, 역할로 검색..."
            value={memberSearch}
            onChange={e => setMemberSearch(e.target.value)}
          />
          <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
            <Ic n="search" s={14} c={C.txL} />
          </span>
          {memberSearch && (
            <span onClick={() => setMemberSearch("")}
              style={{ position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)", cursor: "pointer", color: C.txL, fontSize: 14, lineHeight: 1 }}>×</span>
          )}
        </div>
        {/* 체크박스 목록 */}
        <div style={{ border: `1px solid ${C.brd}`, borderRadius: 6, maxHeight: 180, overflowY: "auto" }}>
          {(() => {
            const q = memberSearch.trim().toLowerCase();
            const filtered = USERS.filter(u => u.useYn === "Y" && (
              !q || u.userNm.toLowerCase().includes(q) || u.userId.toLowerCase().includes(q) || u.userRole.toLowerCase().includes(q)
            ));
            if (filtered.length === 0) return (
              <div style={{ padding: "14px", textAlign: "center", fontSize: 12, color: C.txL }}>
                {q ? `"${memberSearch}" 검색 결과가 없습니다.` : "사용자가 없습니다."}
              </div>
            );
            return filtered.map(u => {
              const checked = form.members.includes(u.userId);
              return (
                <div key={u.userId}
                  onClick={() => {
                    if (checked) set("members", form.members.filter(m => m !== u.userId));
                    else set("members", [...form.members, u.userId]);
                  }}
                  style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", cursor: "pointer",
                    background: checked ? C.priL : "#fff", borderBottom: `1px solid ${C.brd}` }}
                  onMouseEnter={e => { if (!checked) e.currentTarget.style.background = "#F9FAFC"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = checked ? C.priL : "#fff"; }}>
                  <div style={{ width: 16, height: 16, borderRadius: 3, border: `2px solid ${checked ? C.pri : C.brd}`, background: checked ? C.pri : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                  </div>
                  <span style={{ fontSize: 13, color: checked ? C.pri : C.txt, fontWeight: checked ? 600 : 400, flex: 1 }}>{u.userNm}</span>
                  <span style={{ fontSize: 11, color: C.txL }}>{u.userId}</span>
                  <span style={{ fontSize: 10, color: C.txS, background: "#F0F0F0", padding: "1px 6px", borderRadius: 8 }}>{u.userRole}</span>
                </div>
              );
            });
          })()}
        </div>
        <div style={{ fontSize: 11, color: C.txL, marginTop: 6 }}>{form.members.length}명 선택됨</div>
      </div>

      </div>
      <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.brd}`, display: "flex", justifyContent: "flex-end", gap: 8, flexShrink: 0 }}>
        <Btn onClick={handleClose}>취소</Btn>
        <Btn primary onClick={handleSubmit}>등록</Btn>
      </div>
    </div>
    </div>
  );
};

/* ── Panel View Mode (panel | modal) ── */
let _viewMode = "panel";
const getViewMode = () => _viewMode;
const setViewMode = (m) => { _viewMode = m; };

/* ── 미저장 확인 팝업 ── */
const UnsavedConfirm = ({ open, onDiscard, onSave }) => {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.45)" }} />
      <div style={{ position: "relative", background: "#fff", borderRadius: 10, padding: "28px 28px 22px", width: 360, boxShadow: "0 20px 60px rgba(0,0,0,.2)", textAlign: "center" }}>
        <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 22 }}>⚠️</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "#1e293b", marginBottom: 8 }}>수정 사항을 저장하겠습니까?</div>
        <div style={{ fontSize: 13, color: "#64748b", marginBottom: 22 }}>저장하지 않으면 변경 내용이 사라집니다.</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button onClick={onDiscard} style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, border: "1px solid #e2e8f0", borderRadius: 6, background: "#fff", color: "#64748b", cursor: "pointer" }}>저장 안함</button>
          <button onClick={onSave} style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, border: "none", borderRadius: 6, background: "#2563EB", color: "#fff", cursor: "pointer" }}>저장</button>
        </div>
      </div>
    </div>
  );
};

/* ── useEditPanel: editMode + 미저장 확인 공통 훅 ── */
const useEditPanel = (open, onClose) => {
  const [editMode, setEditMode] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  React.useEffect(() => { if (open) { setEditMode(false); setConfirmOpen(false); } }, [open]);
  const startEdit = () => setEditMode(true);
  const requestClose = (saveFn) => {
    if (editMode) { setConfirmOpen(true); }
    else onClose();
  };
  const handleDiscard = () => { setConfirmOpen(false); setEditMode(false); onClose(); };
  const handleSaveConfirm = (saveFn) => { setConfirmOpen(false); if (saveFn) saveFn(); setEditMode(false); };
  const handleSave = () => { setEditMode(false); };
  const handleCancel = () => { if (editMode) setConfirmOpen(true); else onClose(); };
  return { editMode, confirmOpen, startEdit, requestClose, handleDiscard, handleSaveConfirm, handleSave, handleCancel, setConfirmOpen };
};

/* ── Side Panel / Modal Hybrid ── */
const SidePanel = ({ open, onClose, title, width = 520, children }) => {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);
  const [mode, setMode] = useState(getViewMode());
  useEffect(() => {
    if (open) { setVisible(true); setClosing(false); setMode(getViewMode()); }
    else if (visible && !closing) { setVisible(false); }
  }, [open]);
  const handleClose = () => { if (closing) return; setClosing(true); setTimeout(() => { setVisible(false); setClosing(false); onClose(); }, 220); };
  const toggleMode = () => {
    const next = mode === "panel" ? "modal" : "panel";
    setMode(next); setViewMode(next);
  };
  if (!visible) return null;

  const modeIcon = mode === "panel"
    ? <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 1H1v5M15 10v5h-5M1 1l5.5 5.5M15 15l-5.5-5.5"/></svg>
    : <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M1 6h5V1M10 15v-5h5M5.5 6.5L1 11M10.5 9.5L15 5"/></svg>;

  if (mode === "modal") {
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div onClick={handleClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", animation: closing ? "fadeOut .22s ease forwards" : "fadeIn .2s ease" }} />
        <div style={{ position: "relative", background: "#fff", borderRadius: 8, width: Math.min(width + 60, 720), maxWidth: "92vw", maxHeight: "88vh", display: "flex", flexDirection: "column", boxShadow: "0 20px 60px rgba(0,0,0,.2)", animation: closing ? "modalOut .22s ease forwards" : "modalIn .2s ease" }}>
          <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.brd}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: C.txH }}>{title}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
              <div onClick={toggleMode} title="사이드 패널로 전환" style={{ width: 32, height: 32, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.txL }}
                onMouseEnter={e => e.currentTarget.style.background = C.bg} onMouseLeave={e => e.currentTarget.style.background = ""}>{modeIcon}</div>
              <div onClick={handleClose} style={{ width: 32, height: 32, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.txL, fontSize: 18 }}
                onMouseEnter={e => e.currentTarget.style.background = C.bg} onMouseLeave={e => e.currentTarget.style.background = ""}>✕</div>
            </div>
          </div>
          <div style={{ padding: "22px 24px", overflowY: "auto", flex: 1 }}>{children}</div>
        </div>
        <style>{`@keyframes modalIn{from{opacity:0;transform:translateY(12px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}} @keyframes modalOut{from{opacity:1;transform:translateY(0) scale(1)}to{opacity:0;transform:translateY(12px) scale(.97)}} @keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes fadeOut{from{opacity:1}to{opacity:0}}`}</style>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", justifyContent: "flex-end" }}>
      <div onClick={handleClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.35)", animation: closing ? "fadeOut .22s ease forwards" : "fadeIn .2s ease" }} />
      <div style={{ position: "relative", width, maxWidth: "94vw", height: "100vh", background: "#fff", display: "flex", flexDirection: "column", boxShadow: "-8px 0 30px rgba(0,0,0,.12)", animation: closing ? "slideOut .22s ease forwards" : "slideIn .25s ease" }}>
        <div style={{ padding: "18px 24px", borderBottom: `1px solid ${C.brd}`, display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: C.txH }}>{title}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
            <div onClick={toggleMode} title="레이어 팝업으로 전환" style={{ width: 32, height: 32, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.txL }}
              onMouseEnter={e => e.currentTarget.style.background = C.bg} onMouseLeave={e => e.currentTarget.style.background = ""}>{modeIcon}</div>
            <div onClick={handleClose} style={{ width: 32, height: 32, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: C.txL, fontSize: 18 }}
              onMouseEnter={e => e.currentTarget.style.background = "#F9FAFC"} onMouseLeave={e => e.currentTarget.style.background = ""}>✕</div>
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>{children}</div>
      </div>
      <style>{`@keyframes slideIn{from{transform:translateX(100%)}to{transform:translateX(0)}} @keyframes slideOut{from{transform:translateX(0)}to{transform:translateX(100%)}} @keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes fadeOut{from{opacity:1}to{opacity:0}}`}</style>
    </div>
  );
};

/* ── 자원 추가/상세 사이드 패널 ── */
const ResourcePanel = ({ open, onClose, resource, onSubmit, systems }) => {
  const isEdit = !!resource;
  const emptyForm = {
    nm: "", parentNm: "", large: "", mid: "", small: "", st: "사용", mgmtOrg: "", operType: "", importDt: "",
    firstUsage: "", virtualYn: "N", prevUsage: "", usage: "", resourceId: "", detailUsage: "",
    ip: "", serviceIp: "", manufacturer: "", model: "", os: "", serial: "", memory: "", cpuClock: "",
    cpuModel: "", cpuCore: "", cpuArch: "", localDisk: "", memo: "",
    serviceUrl: "", installPath: "", logPath: "",
    serviceUrls: [""], installPaths: [""], logPaths: [""],
    port: "", snmpAccount: "", snmpVersion: "", snmpAuth: "", inspectors: [], sysId: ""
  };
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [inspSearch, setInspSearch] = useState("");
  const [inspOpen, setInspOpen] = useState(false);

  const readOnly = isEdit && !editing;

  const prevResRef = useRef(null);
  useEffect(() => {
    if (open && resource && prevResRef.current !== resource.id) {
      prevResRef.current = resource.id;
      setForm({
        nm: resource.nm || "", parentNm: resource.parentNm || "", large: resource.large || "", mid: resource.mid || "", small: resource.small || "",
        st: resource.st || "사용", mgmtOrg: resource.mgmtOrg || "", operType: resource.operType || "", importDt: resource.importDt || "",
        firstUsage: resource.firstUsage || "", virtualYn: resource.virtualYn || "N", prevUsage: resource.prevUsage || "",
        usage: resource.usage || "", resourceId: resource.resourceId || "", detailUsage: resource.detailUsage || "",
        ip: resource.ip || "", serviceIp: resource.serviceIp || "", manufacturer: resource.manufacturer || "",
        model: resource.model || "", os: resource.os || "", serial: resource.serial || "", memory: resource.memory || "",
        cpuClock: resource.cpuClock || "", cpuModel: resource.cpuModel || "", cpuCore: resource.cpuCore || "",
        cpuArch: resource.cpuArch || "", localDisk: resource.localDisk || "", memo: resource.memo || "",
        serviceUrl: resource.serviceUrl || "", installPath: resource.installPath || "", logPath: resource.logPath || "",
        serviceUrls: resource.serviceUrls || [resource.serviceUrl || ""],
        installPaths: resource.installPaths || [resource.installPath || ""],
        logPaths: resource.logPaths || [resource.logPath || ""],
        port: resource.port || "", snmpAccount: resource.snmpAccount || "", snmpVersion: resource.snmpVersion || "",
        snmpAuth: resource.snmpAuth || "", inspectors: resource.inspectors || ["user01"], sysId: resource.sysId || ""
      });
      setEditing(false);
      setErrors({});
    }
    if (open && !resource && prevResRef.current !== "__new__") {
      prevResRef.current = "__new__";
      setForm(emptyForm);
      setEditing(false);
      setErrors({});
    }
    if (!open) { prevResRef.current = null; }
  }, [open, resource]);

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: undefined })); };

  const largeOptions = ["하드웨어", "소프트웨어"];
  const midOptions = ["서버", "WEB", "WAS", "DBMS", "네트워크", "보안", "스토리지", "백업", "클라우드", "기타"];
  const smallByMid = { "서버": ["Linux", "Windows", "AIX", "HP-UX"], "WEB": ["Apache", "Nginx", "IIS"], "WAS": ["Tomcat", "WebLogic", "JBoss", "JEUS"], "DBMS": ["MySQL", "PostgreSQL", "Oracle", "MSSQL", "MariaDB"], "네트워크": ["L2 Switch", "L3 Switch", "Router", "Firewall"], "보안": ["WAF", "IPS", "IDS", "방화벽"], "스토리지": ["NAS", "SAN", "DAS"], "백업": ["Backup Server", "Tape"], "클라우드": ["AWS", "Azure", "GCP", "NCP"], "기타": ["기타"] };
  const mgmtOrgOptions = ["IT운영팀", "경영지원팀", "재무팀", "물류팀", "홍보팀", "정보보안팀", "데이터팀"];
  const operTypeOptions = ["운영", "개발", "테스트", "DR"];
  const cpuArchOptions = ["x86_64", "ARM64", "SPARC", "POWER"];
  const snmpVersionOptions = ["v1", "v2c", "v3"];

  const validate = () => {
    const e = {};
    if (!form.nm.trim()) e.nm = "자원명은 필수입니다.";
    if (!form.sysId) e.sysId = "정보시스템을 선택해주세요.";
    if (!form.mid) e.mid = "중분류를 선택해주세요.";
    if (!form.small) e.small = "소분류를 선택해주세요.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => { if (validate()) { onSubmit?.(form, isEdit ? resource.id : null); handleClose(); } };
  const handleClose = () => { if (editing) { setConfirmOpen(true); return; } prevResRef.current = null; setForm(emptyForm); setErrors({}); setEditing(false); setInspSearch(""); setInspOpen(false); onClose(); };
  const forceClose = () => { prevResRef.current = null; setForm(emptyForm); setErrors({}); setEditing(false); setInspSearch(""); setInspOpen(false); setConfirmOpen(false); onClose(); };

  const errS = (k) => errors[k] ? { borderColor: C.red } : {};
  const roStyle = readOnly ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none", cursor: "default" } : {};
  const roSelect = readOnly ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none", cursor: "default", appearance: "none", WebkitAppearance: "none", MozAppearance: "none", backgroundImage: "none" } : {};

  return (
    <>
    <UnsavedConfirm open={confirmOpen} onDiscard={forceClose} onSave={() => { setConfirmOpen(false); handleSubmit(); }} />
    <SidePanel open={open} onClose={handleClose} title={isEdit ? (editing ? "자원 수정" : "자원 상세") : "자원 추가"} width={580}>
      {/* 우측 상단 액션 버튼 */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginBottom: 16, marginTop: -6 }}>
        {isEdit && (
          <button onClick={() => {}} style={{ padding: "5px 14px", fontSize: 12, fontWeight: 600,
            border: "1px solid #fca5a5", borderRadius: 6, background: "#fef2f2", color: "#ef4444", cursor: "pointer" }}>삭제</button>
        )}
        {isEdit && readOnly && (
          <button onClick={() => setEditing(true)} style={{ padding: "5px 14px", fontSize: 12, fontWeight: 600,
            border: `1px solid ${C.pri}`, borderRadius: 6, background: C.priL, color: C.pri, cursor: "pointer" }}>수정</button>
        )}
      </div>

      {/* ── 기본 정보 ── */}
      <div style={{ marginBottom: 22 }}>
        {<SecTitle label="기본 정보" primary />}
        <FormRow label="자원명" required>
          <input style={{ ...fInput, ...errS("nm"), ...roStyle }} value={form.nm} onChange={e => set("nm", e.target.value)} placeholder="자원명을 입력하세요" readOnly={readOnly} maxLength={100} />
          {errors.nm && <span style={{ fontSize: 11, color: C.red, marginTop: 2 }}>{errors.nm}</span>}
        </FormRow>
        <FormRow label="소속 정보시스템" required>
          <RoSelect readOnly={readOnly} style={{ ...fSelect, ...errS("sysId") }} value={form.sysId} onChange={e => set("sysId", e.target.value)}>
            <option value="">선택하세요</option>
            {(systems || SYS).map(s => <option key={s.id} value={s.id}>{s.nm}</option>)}
          </RoSelect>
          {errors.sysId && <span style={{ fontSize: 11, color: C.red, marginTop: 2 }}>{errors.sysId}</span>}
        </FormRow>
        <FormRow label="상위 자원명">
          <input style={{ ...fInput, ...roStyle }} value={form.parentNm} onChange={e => set("parentNm", e.target.value)} placeholder="상위 자원명" readOnly={readOnly} maxLength={100} />
        </FormRow>
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="대분류" half>
            <RoSelect readOnly={readOnly} style={{ ...fSelect }} value={form.large} onChange={e => set("large", e.target.value)}>
              <option value="">선택하세요</option>
              {largeOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </RoSelect>
          </FormRow>
          <FormRow label="중분류" required half>
            <RoSelect readOnly={readOnly} style={{ ...fSelect, ...errS("mid") }} value={form.mid} onChange={e => { set("mid", e.target.value); set("small", ""); }}>
              <option value="">선택하세요</option>
              {midOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </RoSelect>
            {errors.mid && <span style={{ fontSize: 11, color: C.red, marginTop: 2 }}>{errors.mid}</span>}
          </FormRow>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="소분류" required half>
            <RoSelect readOnly={readOnly} style={{ ...fSelect, ...errS("small") }} value={form.small} onChange={e => set("small", e.target.value)}>
              <option value="">선택하세요</option>
              {(smallByMid[form.mid] || []).map(s => <option key={s} value={s}>{s}</option>)}
            </RoSelect>
            {errors.small && <span style={{ fontSize: 11, color: C.red, marginTop: 2 }}>{errors.small}</span>}
          </FormRow>
          <FormRow label="자원상태" half>
            <RoSelect readOnly={readOnly} style={{ ...fSelect }} value={form.st} onChange={e => set("st", e.target.value)}>
              <option value="사용">사용</option><option value="미사용">미사용</option>
            </RoSelect>
          </FormRow>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="관리주체" half>
            <RoSelect readOnly={readOnly} style={{ ...fSelect }} value={form.mgmtOrg} onChange={e => set("mgmtOrg", e.target.value)}>
              <option value="">선택하세요</option>
              {mgmtOrgOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </RoSelect>
          </FormRow>
          <FormRow label="운영/개발 구분" half>
            <RoSelect readOnly={readOnly} style={{ ...fSelect }} value={form.operType} onChange={e => set("operType", e.target.value)}>
              <option value="">선택하세요</option>
              {operTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </RoSelect>
          </FormRow>
        </div>
        <FormRow label="자원 ID">
          <div style={{ position: "relative" }}>
            <input style={{ ...fInput, background: "#F9FAFC", color: C.txS, pointerEvents: "none", paddingRight: 80 }}
              value={isEdit ? (form.resourceId || resource?.resourceId || "") : "저장 시 자동생성"}
              readOnly />
            <span style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 10, color: C.txL, background: "#EEEEEE", padding: "2px 6px", borderRadius: 3, pointerEvents: "none" }}>자동생성</span>
          </div>
        </FormRow>
        <FormRow label="도입일">
          <input type="date" style={{ ...fInput, ...roStyle }} value={form.importDt} onChange={e => set("importDt", e.target.value)} readOnly={readOnly} />
        </FormRow>
        <FormRow label="가상화 여부">
          <RoSelect readOnly={readOnly} style={{ ...fSelect }} value={form.virtualYn} onChange={e => set("virtualYn", e.target.value)}>
            <option value="N">No</option><option value="Y">Yes</option>
          </RoSelect>
        </FormRow>
      </div>

      {/* ── 용도 정보 ── */}
      <div style={{ marginBottom: 22 }}>
        {<SecTitle label="용도 정보" />}
        <FormRow label="사용용도">
          <input style={{ ...fInput, ...roStyle }} value={form.usage} onChange={e => set("usage", e.target.value)} placeholder="현재 사용용도" readOnly={readOnly} maxLength={200} />
        </FormRow>
        <FormRow label="최초 사용용도">
          <input style={{ ...fInput, ...roStyle }} value={form.firstUsage} onChange={e => set("firstUsage", e.target.value)} placeholder="최초 사용용도" readOnly={readOnly} maxLength={200} />
        </FormRow>
        <FormRow label="이전 사용용도">
          <input style={{ ...fInput, ...roStyle }} value={form.prevUsage} onChange={e => set("prevUsage", e.target.value)} placeholder="이전 사용용도" readOnly={readOnly} maxLength={200} />
        </FormRow>
        <FormRow label="상세용도">
          <textarea style={{ ...fTextarea, ...(readOnly ? { ...roStyle, resize: "none" } : {}) }} value={form.detailUsage} onChange={e => set("detailUsage", e.target.value)} placeholder="상세용도를 입력하세요" readOnly={readOnly} maxLength={1000} />
        </FormRow>
      </div>

      {/* ── 네트워크 정보 ── */}
      <div style={{ marginBottom: 22 }}>
        {<SecTitle label="네트워크 정보" />}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="장비 IP" half>
            <input style={{ ...fInput, ...roStyle }} value={form.ip} onChange={e => set("ip", e.target.value)} placeholder="192.168.0.1" readOnly={readOnly} maxLength={45} />
          </FormRow>
          <FormRow label="서비스 IP" half>
            <input style={{ ...fInput, ...roStyle }} value={form.serviceIp} onChange={e => set("serviceIp", e.target.value)} placeholder="10.0.0.1" readOnly={readOnly} maxLength={45} />
          </FormRow>
        </div>
        {readOnly && form.ip && (
          <div style={{ marginBottom: 10, padding: "8px 12px", background: "#F9FAFC", borderRadius: 6, fontSize: 11, color: C.txS }}>
            <span style={{ fontWeight: 600 }}>접속 IP 이력: </span>
            <span>2026-02-01 {form.ip} → 2026-01-15 10.0.0.99 → 2025-12-01 172.16.0.50</span>
          </div>
        )}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="포트" half>
            <input style={{ ...fInput, ...roStyle }} value={form.port} onChange={e => set("port", e.target.value.replace(/[^0-9]/g, ""))} placeholder="8080" readOnly={readOnly} maxLength={5} />
          </FormRow>
        </div>

        {/* 서비스 URL — 복수 등록 */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.txS }}>서비스 URL</label>
            {!readOnly && (
              <button onClick={() => set("serviceUrls", [...form.serviceUrls, ""])}
                style={{ display: "flex", alignItems: "center", gap: 3, padding: "2px 8px", fontSize: 11, fontWeight: 600, border: `1px solid ${C.pri}`, borderRadius: 4, color: C.pri, background: C.priL, cursor: "pointer" }}>
                <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> 추가
              </button>
            )}
          </div>
          {form.serviceUrls.map((val, idx) => (
            <div key={idx} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
              <input style={{ ...fInput, flex: 1, marginBottom: 0 }} value={val}
                onChange={e => { const arr = [...form.serviceUrls]; arr[idx] = e.target.value; set("serviceUrls", arr); }}
                placeholder="https://example.com" readOnly={readOnly} maxLength={255} />
              {!readOnly && idx > 0 && (
                <button onClick={() => set("serviceUrls", form.serviceUrls.filter((_, i) => i !== idx))}
                  style={{ flexShrink: 0, width: 26, height: 34, border: "1px solid #fca5a5", borderRadius: 4, background: "#fef2f2", color: "#ef4444", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
              )}
              {idx === 0 && <div style={{ width: 26, flexShrink: 0 }} />}
            </div>
          ))}
        </div>

        {/* 설치경로 — 복수 등록 */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.txS }}>설치경로</label>
            {!readOnly && (
              <button onClick={() => set("installPaths", [...form.installPaths, ""])}
                style={{ display: "flex", alignItems: "center", gap: 3, padding: "2px 8px", fontSize: 11, fontWeight: 600, border: `1px solid ${C.pri}`, borderRadius: 4, color: C.pri, background: C.priL, cursor: "pointer" }}>
                <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> 추가
              </button>
            )}
          </div>
          {form.installPaths.map((val, idx) => (
            <div key={idx} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
              <input style={{ ...fInput, flex: 1, marginBottom: 0 }} value={val}
                onChange={e => { const arr = [...form.installPaths]; arr[idx] = e.target.value; set("installPaths", arr); }}
                placeholder="/opt/app" readOnly={readOnly} maxLength={255} />
              {!readOnly && idx > 0 && (
                <button onClick={() => set("installPaths", form.installPaths.filter((_, i) => i !== idx))}
                  style={{ flexShrink: 0, width: 26, height: 34, border: "1px solid #fca5a5", borderRadius: 4, background: "#fef2f2", color: "#ef4444", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
              )}
              {idx === 0 && <div style={{ width: 26, flexShrink: 0 }} />}
            </div>
          ))}
        </div>

        {/* 로그경로 — 복수 등록 */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.txS }}>로그경로 및 파일</label>
            {!readOnly && (
              <button onClick={() => set("logPaths", [...form.logPaths, ""])}
                style={{ display: "flex", alignItems: "center", gap: 3, padding: "2px 8px", fontSize: 11, fontWeight: 600, border: `1px solid ${C.pri}`, borderRadius: 4, color: C.pri, background: C.priL, cursor: "pointer" }}>
                <span style={{ fontSize: 15, lineHeight: 1 }}>+</span> 추가
              </button>
            )}
          </div>
          {form.logPaths.map((val, idx) => (
            <div key={idx} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
              <input style={{ ...fInput, flex: 1, marginBottom: 0 }} value={val}
                onChange={e => { const arr = [...form.logPaths]; arr[idx] = e.target.value; set("logPaths", arr); }}
                placeholder="/var/log/app.log" readOnly={readOnly} maxLength={255} />
              {!readOnly && idx > 0 && (
                <button onClick={() => set("logPaths", form.logPaths.filter((_, i) => i !== idx))}
                  style={{ flexShrink: 0, width: 26, height: 34, border: "1px solid #fca5a5", borderRadius: 4, background: "#fef2f2", color: "#ef4444", cursor: "pointer", fontSize: 15, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
              )}
              {idx === 0 && <div style={{ width: 26, flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      </div>

      {/* ── 하드웨어/시스템 정보 ── */}
      <div style={{ marginBottom: 22 }}>
        {<SecTitle label="하드웨어/시스템 정보" />}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="제조사" half>
            <input style={{ ...fInput, ...roStyle }} value={form.manufacturer} onChange={e => set("manufacturer", e.target.value)} placeholder="제조사" readOnly={readOnly} maxLength={100} />
          </FormRow>
          <FormRow label="모델명" half>
            <input style={{ ...fInput, ...roStyle }} value={form.model} onChange={e => set("model", e.target.value)} placeholder="모델명" readOnly={readOnly} maxLength={100} />
          </FormRow>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="OS" half>
            <input style={{ ...fInput, ...roStyle }} value={form.os} onChange={e => set("os", e.target.value)} placeholder="CentOS 7" readOnly={readOnly} maxLength={100} />
          </FormRow>
          <FormRow label="시리얼넘버" half>
            <input style={{ ...fInput, ...roStyle }} value={form.serial} onChange={e => set("serial", e.target.value)} placeholder="SN-XXXXXX" readOnly={readOnly} maxLength={50} />
          </FormRow>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="메모리 용량(GB)" half>
            <input style={{ ...fInput, ...roStyle }} value={form.memory} onChange={e => set("memory", e.target.value.replace(/[^0-9]/g, ""))} placeholder="64" readOnly={readOnly} maxLength={5} />
          </FormRow>
          <FormRow label="로컬 디스크 용량(GB)" half>
            <input style={{ ...fInput, ...roStyle }} value={form.localDisk} onChange={e => set("localDisk", e.target.value.replace(/[^0-9]/g, ""))} placeholder="500" readOnly={readOnly} maxLength={6} />
          </FormRow>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="CPU 모델" half>
            <input style={{ ...fInput, ...roStyle }} value={form.cpuModel} onChange={e => set("cpuModel", e.target.value)} placeholder="Intel Xeon E5-2680" readOnly={readOnly} maxLength={100} />
          </FormRow>
          <FormRow label="CPU 클럭 속도(GHz)" half>
            <input style={{ ...fInput, ...roStyle }} value={form.cpuClock} onChange={e => set("cpuClock", e.target.value.replace(/[^0-9.]/g, ""))} placeholder="2.40" readOnly={readOnly} maxLength={5} />
          </FormRow>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="CPU 코어수" half>
            <input style={{ ...fInput, ...roStyle }} value={form.cpuCore} onChange={e => set("cpuCore", e.target.value.replace(/[^0-9]/g, ""))} placeholder="16" readOnly={readOnly} maxLength={3} />
          </FormRow>
          <FormRow label="CPU 아키텍처" half>
            <RoSelect readOnly={readOnly} style={{ ...fSelect }} value={form.cpuArch} onChange={e => set("cpuArch", e.target.value)}>
              <option value="">선택하세요</option>
              {cpuArchOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </RoSelect>
          </FormRow>
        </div>
      </div>

      {/* ── SNMP 정보 ── */}
      <div style={{ marginBottom: 22 }}>
        {<SecTitle label="SNMP 정보" />}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="SNMP 계정정보" half>
            <input style={{ ...fInput, ...roStyle }} value={form.snmpAccount} onChange={e => set("snmpAccount", e.target.value)} placeholder="계정정보" readOnly={readOnly} maxLength={50} />
          </FormRow>
          <FormRow label="SNMP 버전" half>
            <RoSelect readOnly={readOnly} style={{ ...fSelect }} value={form.snmpVersion} onChange={e => set("snmpVersion", e.target.value)}>
              <option value="">선택하세요</option>
              {snmpVersionOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </RoSelect>
          </FormRow>
        </div>
        <FormRow label="SNMP 인증정보">
          <textarea style={{ ...fTextarea, ...(readOnly ? { ...roStyle, resize: "none" } : {}) }} value={form.snmpAuth} onChange={e => set("snmpAuth", e.target.value)} placeholder="SNMP 인증정보를 입력하세요" readOnly={readOnly} maxLength={500} />
        </FormRow>
      </div>

      {/* ── 비고 ── */}
      <div style={{ marginBottom: 22 }}>
        {<SecTitle label="기타" />}
        <FormRow label="비고">
          <textarea style={{ ...fTextarea, ...(readOnly ? { ...roStyle, resize: "none" } : {}) }} value={form.memo} onChange={e => set("memo", e.target.value)} placeholder="기타 메모 정보" readOnly={readOnly} maxLength={500} />
        </FormRow>
      </div>

      {/* ── 점검자 ── */}
      <div style={{ marginBottom: 22 }}>
        {<SecTitle label="점검자" />}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {form.inspectors.map(uid => {
            const u = USERS.find(x => x.userId === uid);
            return u ? (
              <span key={uid} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 14, background: C.priL, color: C.priD, fontSize: 12, fontWeight: 500 }}>
                {u.userNm} ({u.userRole})
                {!readOnly && <span onClick={() => set("inspectors", form.inspectors.filter(m => m !== uid))} style={{ cursor: "pointer", marginLeft: 2, fontSize: 14, lineHeight: 1 }}>×</span>}
              </span>
            ) : null;
          })}
          {form.inspectors.length === 0 && <span style={{ fontSize: 12, color: C.txL }}>점검자가 없습니다.</span>}
        </div>
        {!readOnly && (() => {
          const candidates = USERS.filter(u => u.useYn === "Y").filter(u => {
            if (inspSearch) {
              const q = inspSearch.toLowerCase();
              return u.userNm.toLowerCase().includes(q) || u.userId.toLowerCase().includes(q) || u.userRole.toLowerCase().includes(q);
            }
            return true;
          });
          return <div style={{ position: "relative" }}>
            <div style={{ position: "relative" }}>
              <input
                style={{ ...fInput, paddingLeft: 30, fontSize: 12, maxWidth: 340 }}
                placeholder="이름, 아이디, 역할로 검색..."
                value={inspSearch}
                onChange={e => { setInspSearch(e.target.value); setInspOpen(true); }}
                onFocus={() => setInspOpen(true)}
              />
              <span style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><Ic n="search" s={14} c={C.txL} /></span>
            </div>
            {inspOpen && <div style={{
              position: "absolute", top: "100%", left: 0, right: 0, maxWidth: 340, marginTop: 4, zIndex: 50,
              background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 8,
              boxShadow: "0 8px 24px rgba(0,0,0,.12)", maxHeight: 220, overflowY: "auto"
            }}>
              {candidates.length === 0 && <div style={{ padding: "12px", textAlign: "center", fontSize: 12, color: C.txL }}>
                {inspSearch ? `"${inspSearch}" 검색 결과가 없습니다.` : "추가 가능한 사용자가 없습니다."}
              </div>}
              {candidates.map(u => {
                const checked = form.inspectors.includes(u.userId);
                return <div
                  key={u.userId}
                  onClick={() => {
                    if (checked) set("inspectors", form.inspectors.filter(x => x !== u.userId));
                    else set("inspectors", [...form.inspectors, u.userId]);
                  }}
                  style={{
                    padding: "8px 12px", cursor: "pointer", borderBottom: `1px solid ${C.brd}`,
                    display: "flex", alignItems: "center", gap: 8, fontSize: 12,
                    background: checked ? C.priL : ""
                  }}
                  onMouseEnter={e => { if (!checked) e.currentTarget.style.background = "#F9FAFC"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = checked ? C.priL : ""; }}
                >
                  <div style={{
                    width: 16, height: 16, borderRadius: 3, border: `2px solid ${checked ? C.pri : C.brd}`,
                    background: checked ? C.pri : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                  }}>
                    {checked && <span style={{ color: "#fff", fontSize: 10, fontWeight: 700 }}>✓</span>}
                  </div>
                  <span style={{ fontWeight: 500, flex: 1 }}>{u.userNm}</span>
                  <span style={{ fontSize: 10, color: C.txL }}>{u.userId}</span>
                  <span style={{ fontSize: 10, color: C.txS, background: "#F9FAFC", padding: "1px 6px", borderRadius: 8 }}>{u.userRole}</span>
                </div>;
              })}
              {candidates.length > 0 && <div style={{ padding: "6px 12px", fontSize: 10, color: C.txL, textAlign: "center", background: "#F9FAFC", display: "flex", justifyContent: "space-between" }}>
                <span>{form.inspectors.length}명 선택됨</span>
                <span onClick={() => setInspOpen(false)} style={{ cursor: "pointer", color: C.pri, fontWeight: 600 }}>닫기</span>
              </div>}
            </div>}
            {inspOpen && <div style={{ position: "fixed", inset: 0, zIndex: 49 }} onClick={() => setInspOpen(false)} />}
          </div>;
        })()}
      </div>

      {/* 하단 버튼 */}
      {!readOnly && <PanelFooter onCancel={() => { if (isEdit) { setEditing(false); } else handleClose(); }} onSave={handleSubmit} saveLabel={isEdit ? "저장" : "등록"} />}
      {readOnly && <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 16, borderTop: `1px solid ${C.brd}` }}><Btn onClick={handleClose}>닫기</Btn></div>}
    </SidePanel>
    </>
  );
};
const MM = [
  { k: "d", l: "대시보드", i: "dash", p: "md" },
  { k: "r", l: "자원관리", i: "db", p: "mr" },
  { k: "i", l: "점검현황", i: "search", c: [
    { k: "is", l: "점검현황", p: "mis" },
    { k: "ic", l: "정기점검 스케줄", p: "mic" },
    { k: "id", l: "일상점검", p: "mid" },
    { k: "ip", l: "특별점검", p: "mip" },
    { k: "ih", l: "점검이력", p: "mih" },
  ]},
  { k: "b", l: "게시판", i: "bell", c: [{ k: "bn", l: "공지사항", p: "mbn" }, { k: "bl", l: "자료실", p: "mbl" }] },
  { k: "s", l: "환경설정", i: "gear", c: [
    { k: "sg1", l: "일반설정", group: true, c: [
      { k: "sp", l: "시스템 프로필", p: "msp" },
      { k: "sc", l: "공통코드", p: "msc" },
      { k: "sa", l: "기본알림", p: "msa" },
      { k: "sk", l: "카테고리 관리", p: "msk" },
      { k: "sh", l: "휴무일설정", p: "msh" },
      { k: "slm", l: "로그인 안내메시지", p: "mslm" },
      { k: "snb", l: "공지배너", p: "msnb" },
    ]},
    { k: "sg2", l: "라이선스", group: true, c: [
      { k: "sl", l: "라이선스", p: "msl" },
    ]},
    { k: "sg3", l: "사용자 관리", group: true, c: [
      { k: "su", l: "사용자", p: "msu" },
    ]},
    { k: "sg4", l: "점검표", group: true, c: [
      { k: "st", l: "점검표", p: "mst" },
      { k: "sv", l: "검증코드", p: "msv" },
    ]},
    { k: "sg5", l: "로그정보", group: true, c: [
      { k: "la", l: "접속로그", p: "mla" },
      { k: "lr", l: "자원로그", p: "mlr" },
      { k: "li", l: "점검로그", p: "mli" },
      { k: "lp", l: "권한변경로그", p: "mlp" },
      { k: "le", l: "에러로그", p: "mle" },
    ]},
    { k: "sg6", l: "보안 및 개발", group: true, c: [
      { k: "ssc", l: "시스템코드", p: "mssc" },
      { k: "sag", l: "AGENT 권한관리", p: "msag" },
      { k: "sapi", l: "API 관리", p: "msapi" },
    ]},
    { k: "sg7", l: "시스템정보", group: true, c: [
      { k: "si", l: "시스템정보", p: "msi" },
    ]},
  ]},
];
const SM = [
  { k: "sd", l: "대시보드", i: "dash", p: "sd" },
  { k: "sl", l: "일상점검", i: "check", p: "sll" },
  { k: "ss", l: "특별점검", i: "alert", p: "ssl" },
  { k: "sb", l: "게시판", i: "bell", c: [{ k: "sbn", l: "공지사항", p: "sbn" }, { k: "sbl", l: "자료실", p: "sbl" }] },
  { k: "se", l: "환경설정", i: "gear", c: [
    { k: "sep", l: "일반설정", p: "sep" },
    { k: "sel", l: "라이선스", p: "sel" },
    { k: "sei", l: "시스템정보", p: "sei" },
  ]},
];

/* ── Sidebar (1Depth 아이콘바 + 2/3Depth 텍스트 패널) ── */
const Side = ({ menus, cur, nav, site, col, toggle }) => {
  const [selMenu, setSelMenu] = useState(null);
  const [openGroups, setOpenGroups] = useState({});
  const st = sideTheme[site] || sideTheme.m;

  /* 현재 페이지가 속한 1depth 자동 추적 */
  const findActive1 = () => {
    for (const m of menus) {
      if (m.p === cur) return m.k;
      if (m.c) {
        for (const ch of m.c) {
          if (ch.p === cur) return m.k;
          if (ch.group && ch.c && ch.c.some(g => g.p === cur)) return m.k;
        }
      }
    }
    return null;
  };
  const curKey = findActive1();

  /* 현재 페이지가 속한 그룹 자동 추적 */
  const findActiveGroup = (menu) => {
    if (!menu?.c) return null;
    for (const ch of menu.c) {
      if (ch.group && ch.c && ch.c.some(g => g.p === cur)) return ch.k;
    }
    return null;
  };

  /* 1depth 클릭 */
  const click1 = (m) => {
    if (m.c) {
      setSelMenu(m.k);
      /* 첫 번째 leaf 메뉴로 이동 */
      const firstLeaf = (items) => {
        for (const it of items) {
          if (it.p) return it.p;
          if (it.c) { const r = firstLeaf(it.c); if (r) return r; }
        }
        return null;
      };
      const fp = firstLeaf(m.c);
      if (fp) nav(fp);
    } else {
      nav(m.p);
      setSelMenu(null);
    }
  };

  /* 그룹 토글 */
  const toggleGroup = (gk) => {
    setOpenGroups(prev => ({ ...prev, [gk]: !prev[gk] }));
  };

  /* 2depth 표시 대상 결정 */
  const shown = selMenu || curKey;
  const shownMenu = menus.find(m => m.k === shown);
  const depth2 = shownMenu?.c || [];
  const show2 = depth2.length > 0;
  const isGrouped = depth2.some(ch => ch.group);

  /* 그룹 열림 상태 (활성 그룹은 기본 열림) */
  const activeGroup = findActiveGroup(shownMenu);
  const isGroupOpen = (gk) => {
    if (gk in openGroups) return openGroups[gk];
    return gk === activeGroup; // 활성 그룹 기본 열림
  };

  /* 모든 leaf 메뉴의 p 값 수집 (active1 판별용) */
  const allLeafs = (items) => {
    const ps = [];
    for (const it of items || []) {
      if (it.p) ps.push(it.p);
      if (it.c) ps.push(...allLeafs(it.c));
    }
    return ps;
  };

  return (
    <div style={{ display: "flex", flexShrink: 0, height: "calc(100vh - 67px)", position: "sticky", top: 67 }}>
      {/* ── 1Depth 아이콘바 (64px, 파란 배경 #005CB9) ── */}
      <div style={{ display: "flex", flexDirection: "column", flexShrink: 0, width: 64, background: C.bg, position: "relative" }}>
        {/* 아이콘 리스트 (border-radius 상단 우측 라운드) */}
        <div style={{ flex: 1, width: 64, display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0", gap: 4, borderRadius: "0 24px 0 0", background: C.brand }}>
          {menus.map(m => {
            const isA = m.k === curKey;
            const isOpen = shown === m.k;
            return <div
              key={m.k}
              onClick={() => click1(m)}
              style={{
                width: 56, padding: "6px 0", borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
                cursor: "pointer", transition: "all .3s",
                background: isOpen ? "rgba(17,17,17,0.3)" : isA ? "rgba(17,17,17,0.2)" : "transparent",
              }}
              onMouseEnter={e => { if (!isA && !isOpen) e.currentTarget.style.background = "rgba(17,17,17,0.3)"; }}
              onMouseLeave={e => { if (!isA && !isOpen) e.currentTarget.style.background = "transparent"; }}
            >
              <Ic n={m.i} s={18} c={isA || isOpen ? "#fff" : "rgba(255,255,255,0.55)"} />
              <span style={{ fontSize: 9, fontWeight: 500, color: isA || isOpen ? "#fff" : "rgba(255,255,255,0.55)", lineHeight: 1.2, whiteSpace: "nowrap", letterSpacing: "-0.3px" }}>{m.l}</span>
            </div>;
          })}
        </div>
      </div>

      {/* ── 2/3Depth 텍스트 패널 (190px) ── */}
      <div style={{ width: show2 ? 190 : 0, background: C.bg, display: "flex", flexDirection: "column", overflow: "hidden", transition: "width .25s ease", flexShrink: 0 }}>
        <div style={{ width: 190, opacity: show2 ? 1 : 0, transition: "opacity .2s ease .05s", display: "flex", flexDirection: "column", flex: 1, overflowY: "auto" }}>
        {/* 메뉴/즐겨찾기 탭 - 숨김 */}
      {/* ── 2/3Depth 텍스트 패널 메뉴 리스트 ── */}
        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          {!isGrouped && depth2.map(ch => {
            const isA = cur === ch.p;
            return <div
              key={ch.k}
              onClick={() => nav(ch.p)}
              style={{
                padding: "4px 8px", cursor: "pointer", marginBottom: 4, borderRadius: 4,
                fontSize: 15, fontWeight: 500,
                background: isA ? C.priL : "", color: isA ? C.sec : C.txt,
                display: "flex", alignItems: "center", gap: 4,
                minHeight: 36, transition: "all .3s"
              }}
              onMouseEnter={e => { if (!isA) e.currentTarget.style.background = C.secL; }}
              onMouseLeave={e => { if (!isA) e.currentTarget.style.background = ""; }}
            >
              {ch.l}
            </div>;
          })}

          {isGrouped && depth2.map(grp => {
            if (!grp.group) return null;
            const open = isGroupOpen(grp.k);
            const hasActive = grp.c && grp.c.some(g => g.p === cur);
            const isSingle = grp.c && grp.c.length === 1;
            return <div key={grp.k}>
              {/* 2depth 그룹 헤더 */}
              <div
                onClick={() => isSingle ? nav(grp.c[0].p) : toggleGroup(grp.k)}
                style={{
                  padding: "4px 8px", cursor: "pointer", borderRadius: 4, marginBottom: 4,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  fontSize: 15, fontWeight: 500, minHeight: 36,
                  color: hasActive || (isSingle && cur === grp.c[0].p) ? C.sec : C.txt,
                  background: isSingle && cur === grp.c[0].p ? C.priL : "",
                  transition: "all .3s", userSelect: "none"
                }}
                onMouseEnter={e => { e.currentTarget.style.background = C.secL; }}
                onMouseLeave={e => { e.currentTarget.style.background = isSingle && cur === grp.c[0].p ? C.priL : ""; }}
              >
                <span>{grp.l}</span>
                {!isSingle && <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, transition: "all .3s", transform: open ? "rotate(90deg)" : "none" }}>
                  <svg width="8" height="12" viewBox="0 0 8 12" fill="none"><path d="M1.5 1l5 5-5 5" stroke={hasActive ? C.sec : "#333"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </span>}
              </div>
              {/* 3depth 아이템 */}
              {!isSingle && open && grp.c && grp.c.map(item => {
                const isA = cur === item.p;
                return <div
                  key={item.k}
                  onClick={() => nav(item.p)}
                  style={{
                    padding: "4px 8px 4px 20px", cursor: "pointer", borderRadius: 4, marginBottom: 4,
                    fontSize: 14, fontWeight: isA ? 500 : 400, minHeight: 36,
                    background: isA ? C.priL : "", color: isA ? C.sec : C.txS,
                    display: "flex", alignItems: "center", gap: 4,
                    transition: "all .3s"
                  }}
                  onMouseEnter={e => { if (!isA) e.currentTarget.style.background = C.secL; }}
                  onMouseLeave={e => { if (!isA) e.currentTarget.style.background = ""; }}
                >
                  <span style={{ color: "#BBBBBB", fontSize: 11, marginRight: 2 }}>└</span>{item.l}
                </div>;
              })}
            </div>;
          })}
        </nav>
      </div></div>
    </div>
  );
};

/* ── Header ── */
const NOTI = [
  { id: 1, msg: "CRM-SVR-01 일상점검이 지연되고 있습니다.", dt: "2026-02-11 09:30", read: false },
  { id: 2, msg: "보안장비 이중화 절체 테스트가 등록되었습니다.", dt: "2026-02-11 09:00", read: false },
  { id: 3, msg: "HR-WEB-01 점검 결과가 제출되었습니다.", dt: "2026-02-11 08:45", read: false },
  { id: 4, msg: "네트워크 장비 월간점검 스케줄이 변경되었습니다.", dt: "2026-02-11 08:30", read: false },
  { id: 5, msg: "CRM-DB-01 자동점검에서 비정상이 감지되었습니다.", dt: "2026-02-10 17:20", read: false },
  { id: 6, msg: "메일서버 성능 부하 테스트가 지연되고 있습니다.", dt: "2026-02-10 16:00", read: true },
  { id: 7, msg: "2026년 1분기 정기점검 일정이 공지되었습니다.", dt: "2026-02-10 14:30", read: true },
  { id: 8, msg: "FIN-DB-02 디스크 사용률이 90%를 초과했습니다.", dt: "2026-02-10 13:00", read: true },
  { id: 9, msg: "GW-WAS-03 서비스 포트 점검 실패.", dt: "2026-02-10 11:20", read: true },
  { id: 10, msg: "LOG-SVR-05 점검 보고가 완료되었습니다.", dt: "2026-02-10 10:00", read: true },
  { id: 11, msg: "보안관제시스템 보안패치 확인이 필요합니다.", dt: "2026-02-09 17:30", read: true },
  { id: 12, msg: "WEB 서비스 일간점검이 정상 완료되었습니다.", dt: "2026-02-09 15:00", read: true },
];
const BellIcon = () => <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10 18c.83 0 1.5-.67 1.5-1.5h-3c0 .83.67 1.5 1.5 1.5z"/><path d="M16 13V9.5c0-3-2.13-5.49-5-5.95V3a1 1 0 10-2 0v.55C6.13 4.01 4 6.5 4 9.5V13l-1.5 2h15L16 13z"/></svg>;
const NotiDrop = ({ items, onClose, onRead }) => (
  <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 8, width: 360, maxHeight: 440, background: "#fff", borderRadius: 10, boxShadow: "0 10px 40px rgba(0,0,0,.16)", border: `1px solid ${C.brd}`, zIndex: 2000, display: "flex", flexDirection: "column", animation: "modalIn .15s ease" }}>
    <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.brd}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <span style={{ fontSize: 14, fontWeight: 700 }}>알림</span>
      <span onClick={onRead} style={{ fontSize: 11, color: C.pri, cursor: "pointer" }}>모두 읽음</span>
    </div>
    <div style={{ flex: 1, overflowY: "auto" }}>
      {items.length === 0 && <div style={{ padding: 32, textAlign: "center", color: C.txL, fontSize: 13 }}>알림이 없습니다.</div>}
      {items.slice(0, 20).map(n => (
        <div key={n.id} style={{ padding: "10px 16px", borderBottom: `1px solid ${C.brd}`, background: n.read ? "" : C.priL, cursor: "pointer" }}
          onMouseEnter={e => e.currentTarget.style.background = n.read ? "#F9FAFC" : C.secL} onMouseLeave={e => e.currentTarget.style.background = n.read ? "" : C.priL}>
          <div style={{ fontSize: 12, color: n.read ? C.txS : C.txt, fontWeight: n.read ? 400 : 500, lineHeight: 1.5 }}>
            {!n.read && <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: 3, background: C.pri, marginRight: 6, verticalAlign: "middle" }} />}
            {n.msg}
          </div>
          <div style={{ fontSize: 10, color: C.txL, marginTop: 3 }}>{n.dt}</div>
        </div>
      ))}
    </div>
  </div>
);
const Hdr = ({ user, site, sw, logout, siteName, onPwChange, bannerH = 0 }) => {
  const [noti, setNoti] = useState(NOTI);
  const [showNoti, setShowNoti] = useState(false);
  const unread = noti.filter(n => !n.read).length;
  const markAll = () => setNoti(noti.map(n => ({ ...n, read: true })));
  useEffect(() => { if (!showNoti) return; const h = (e) => { if (!e.target.closest?.("[data-noti]")) setShowNoti(false); }; document.addEventListener("click", h); return () => document.removeEventListener("click", h); }, [showNoti]);
  return (
    <div style={{ background: C.brand, position: "fixed", top: bannerH, left: 0, width: "100%", zIndex: 200 }}>
    <div style={{ height: 67, background: C.bg, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px 0 20px", fontSize: 13, flexShrink: 0, borderRadius: "0 0 0 20px" }}>
      {/* 좌측: 로고 - 디자인 가이드 logo-area */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 8, background: C.brandG, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>C</div>
        <span style={{ fontSize: 21, fontWeight: 600, color: C.txH }}>
          <span style={{ color: C.brand }}>COMPLY</span>SIGHT<span onClick={user?.userRole !== "사용자" ? sw : undefined}
            style={{ paddingLeft: 12, fontSize: 18, fontWeight: 600, color: C.brand, cursor: user?.userRole !== "사용자" ? "pointer" : "default", transition: "opacity .2s" }}
            onMouseEnter={e => { if (user?.userRole !== "사용자") e.currentTarget.style.opacity = "0.6"; }}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            title={user?.userRole !== "사용자" ? (site === "m" ? "Sentinel로 전환" : "Manager로 전환") : ""}>{siteName}</span>
        </span>
      </div>
      {/* 우측: GNB */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ color: C.txt, fontSize: 14 }}>고객행복센터</span>
        <div style={{ width: 1, height: 12, background: C.brdD }} />
        <span style={{ color: C.txt, fontSize: 14 }}>업무담당자 : <span style={{ fontWeight: 700 }}>{user?.userNm}</span>
          <span onClick={onPwChange} style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", marginLeft: 4, verticalAlign: "middle", opacity: .5, transition: "opacity .2s" }} title="비밀번호 변경"
            onMouseEnter={e => e.currentTarget.style.opacity = "1"}
            onMouseLeave={e => e.currentTarget.style.opacity = ".5"}>
            <Ic n="gear" s={13} c={C.txS} />
          </span>
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 6, background: "#edf0f6", borderRadius: 100, padding: "4px 10px", fontSize: 12 }}>
          <Ic n="clock" s={12} c={C.txS} />
          <span style={{ color: C.txS }}>99:99</span>
          <span style={{ color: C.accent, fontWeight: 500, cursor: "pointer" }}>로그인연장</span>
        </div>
        <div data-noti="1" style={{ position: "relative", cursor: "pointer", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={(e) => { e.stopPropagation(); setShowNoti(!showNoti); }}>
          <BellIcon />
          {unread > 0 && <span style={{ position: "absolute", top: 2, right: 2, minWidth: 16, height: 16, borderRadius: 8, background: C.red, color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", border: "2px solid #fff" }}>{unread}</span>}
          {showNoti && <NotiDrop items={noti} onClose={() => setShowNoti(false)} onRead={markAll} />}
        </div>
        <div onClick={logout} style={{ cursor: "pointer", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, border: `1px solid ${C.brd}` }} title="로그아웃"><Ic n="out" s={16} c={C.txS} /></div>
      </div>
    </div>
    </div>
  );
};

/* ──── COMMON PANEL: 일상점검 보고 패널 ──── */
const DailyReportPanel = ({ open, onClose, item, canReport = false }) => {
  const emptyForm = {
    nm: "", sysId: "", resources: [], _resCat: "", _resSearch: "",
    reportDeadlineDate: "", reportDeadlineTime: "18:00",
    st: "사용", priority: 1, alertYn: "Y",
    memo: ""
  };
  const [form, setForm] = useState(emptyForm);
  const [showPreview, setShowPreview] = useState(false);
  const [showAutoConfirm, setShowAutoConfirm] = useState(false);
  const [isAutoLoading, setIsAutoLoading] = useState(false);
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [eyeResult, setEyeResult] = useState("");
  const [eyeNote, setEyeNote] = useState("");
  const [eyePhotos, setEyePhotos] = useState([]);

  /* 센티널 점검결과 mock 데이터 */
  const sentinelResults = (item?.st === "완료" || item?.st === "진행") ? [
    { id: 1, nm: "CPU 사용률",       status: "정상",   inspStart: item.execDt || (item.due + " 09:00"), inspEnd: item.execDt || (item.due + " 09:02"), reportedAt: item.submitDt || (item.due + " 09:30"), val: "72%",  std: "< 80%" },
    { id: 2, nm: "메모리 사용률",    status: "정상",   inspStart: item.execDt || (item.due + " 09:02"), inspEnd: item.execDt || (item.due + " 09:04"), reportedAt: item.submitDt || (item.due + " 09:30"), val: "68%",  std: "< 85%" },
    { id: 3, nm: "디스크 사용률",    status: item.st === "진행" ? "점검중" : "정상",   inspStart: item.execDt || (item.due + " 09:04"), inspEnd: item.execDt || (item.due + " 09:06"), reportedAt: item.st === "진행" ? "—" : (item.submitDt || (item.due + " 09:30")), val: "54%",  std: "< 90%" },
    { id: 4, nm: "서비스 포트 확인", status: item.st === "진행" ? "점검중" : "정상",   inspStart: item.execDt || (item.due + " 09:06"), inspEnd: item.execDt || (item.due + " 09:07"), reportedAt: item.st === "진행" ? "—" : (item.submitDt || (item.due + " 09:30")), val: "OPEN", std: "OPEN" },
    { id: 5, nm: "로그 에러 확인",   status: item.st === "진행" ? "대기중" : "비정상", inspStart: item.execDt || (item.due + " 09:07"), inspEnd: item.execDt || (item.due + " 09:10"), reportedAt: item.st === "진행" ? "—" : (item.submitDt || (item.due + " 09:30")), val: "3건",  std: "0건" },
    { id: 6, nm: "보안패치 상태",    status: item.st === "진행" ? "대기중" : "정상",   inspStart: item.execDt || (item.due + " 09:10"), inspEnd: item.execDt || (item.due + " 09:12"), reportedAt: item.st === "진행" ? "—" : (item.submitDt || (item.due + " 09:30")), val: "최신", std: "최신" },
  ] : [];

  useEffect(() => {
    if (open && item) {
      const sysObj = SYS.find(s => s.nm === item.sysNm);
      setForm({
        nm: item.clNm || item.resNm || "",
        sysId: sysObj?.id || "",
        resources: item.resNm ? [item.resNm] : [],
        _resCat: "", _resSearch: "",
        reportDeadlineDate: item.due || "",
        reportDeadlineTime: "18:00",
        st: "사용", priority: 1, alertYn: "Y",
        memo: item.memo || ""
      });
      setShowPreview(false);
    }
    if (open && !item) { setForm(emptyForm); setShowPreview(false); }
  }, [open, item]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const isLocked = item?.st === "완료" || item?.st === "진행";
  const roS = { background: "#F9FAFC", color: C.txt, pointerEvents: "none" };

  const hasResults = sentinelResults.length > 0;
  const defectCount = sentinelResults.filter(r => r.status === "비정상").length;

  return (
    <SidePanel open={open} onClose={onClose} title="점검 상세" width={showPreview ? 1160 : 600}>
      {item && <>

        {/* 본문: 폼 + 미리보기 2컬럼 */}
        <div style={{ display: "flex", gap: 0, minHeight: 0 }}>
          {/* 좌: 폼 컬럼 */}
          <div style={{ flex: "0 0 560px", minWidth: 0, paddingRight: showPreview ? 20 : 0, borderRight: showPreview ? `1px solid ${C.brd}` : "none", overflowY: showPreview ? "auto" : "visible", maxHeight: showPreview ? "calc(100vh - 160px)" : "none" }}>

        {/* ── 점검 정보 ── */}
        <div style={{ marginBottom: 18 }}>
          {<SecTitle label="점검 정보" primary />}
          <FormRow label="점검 명" required>
            <input style={{ ...fInput, ...roS }} value={form.nm} readOnly />
          </FormRow>
          <div style={{ display: "flex", gap: 12 }}>
            <FormRow label="정보시스템" half>
              <input style={{ ...fInput, ...roS }} value={item?.sysNm || "—"} readOnly />
            </FormRow>
            <FormRow label="자원명" half>
              <input style={{ ...fInput, ...roS }} value={item?.resNm || "—"} readOnly />
            </FormRow>
          </div>

          {/* 대상 자원 태그 */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 600, color: C.txS }}>
                대상 자원 <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <span style={{ fontSize: 11, color: C.txL }}>{form.resources.length}개 선택됨</span>
            </div>
            {form.resources.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
                {form.resources.map(rid => {
                  const r = RES.find(x => x.id === rid || x.nm === rid);
                  const cl = r ? CL.find(c => c.sub === r.mid) : null;
                  return (
                    <span key={rid} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 10, background: C.priL, color: C.priD, fontSize: 11, fontWeight: 600 }}>
                      {r ? r.nm : rid}
                      {cl && <span style={{ fontWeight: 400, color: C.pri }}>({cl.nm})</span>}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── 보고기한 ── */}
        <div style={{ marginBottom: 18 }}>
          {<SecTitle label="보고기한" />}
          <div style={{ display: "flex", gap: 12 }}>
            <FormRow label="보고기한 날짜" required half>
              <input type="date" style={{ ...fInput, ...roS }} value={form.reportDeadlineDate} readOnly />
            </FormRow>
            <FormRow label="보고기한 시간" required half>
              <input type="time" style={{ ...fInput, ...roS }} value={form.reportDeadlineTime} readOnly />
            </FormRow>
          </div>
          <div style={{ fontSize: 10, color: C.txL, marginTop: -4, marginBottom: 4 }}>해당 시간까지 보고를 완료하지 않으면 "지연" 상태로 전환됩니다.</div>
        </div>

        {/* 자동점검수행 컨펌 모달 */}
        {showAutoConfirm && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ background: "#fff", borderRadius: 10, padding: "28px 32px", width: 340, boxShadow: "0 8px 32px rgba(0,0,0,.18)" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: C.txt, marginBottom: 10 }}>자동점검 수행</div>
              <div style={{ fontSize: 13, color: C.txS, lineHeight: 1.7, marginBottom: 24 }}>자동점검을 수행 합니다.</div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                <button onClick={() => setShowAutoConfirm(false)} style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, borderRadius: 4, border: `1px solid ${C.brd}`, background: "#fff", color: C.txt, cursor: "pointer" }}>아니오</button>
                <button
                  onClick={() => {
                    setShowAutoConfirm(false);
                    setIsAutoLoading(true);
                    setTimeout(() => setIsAutoLoading(false), 3000);
                  }}
                  style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, borderRadius: 4, border: "none", background: C.sec, color: "#fff", cursor: "pointer" }}>예</button>
              </div>
            </div>
          </div>
        )}

        {/* 전체화면 프리로더 */}
        {isAutoLoading && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.55)", zIndex: 10000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 20 }}>
            <div style={{ position: "relative", width: 64, height: 64 }}>
              {/* 외부 링 */}
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid rgba(255,255,255,.15)" }} />
              {/* 스피너 */}
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid transparent", borderTopColor: "#fff", animation: "spin .9s linear infinite" }} />
              {/* 내부 펄스 */}
              <div style={{ position: "absolute", inset: 14, borderRadius: "50%", background: "rgba(255,255,255,.18)", animation: "pulse2 1.4s ease-in-out infinite" }} />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 6 }}>자동점검 수행 중</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)" }}>코어 서버에 점검을 요청하고 있습니다...</div>
            </div>
            <style>{`
              @keyframes spin { to { transform: rotate(360deg); } }
              @keyframes pulse2 { 0%,100% { opacity:.3; transform:scale(.85); } 50% { opacity:.7; transform:scale(1.1); } }
            `}</style>
          </div>
        )}

        {/* ── 자동 점검 결과 (센티널) ── */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <SecTitle label="자동 점검 결과" style={{ marginBottom: 0 }} />
            <div style={{ display: "flex", gap: 6 }}>
              {/* 자동점검수행 버튼 */}
              {canReport && (
                <button
                  onClick={() => setShowAutoConfirm(true)}
                  style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4, border: `1px solid ${C.pri}`, background: C.priL, color: C.pri, cursor: "pointer" }}>
                  <svg width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="7" r="6"/><path d="M5 7l2 2 3-3"/></svg>
                  자동점검수행
                </button>
              )}
              {hasResults && (
                <>
                  <button
                    onClick={() => {
                      const today = new Date();
                      const tdStr = `${today.getFullYear()}년 ${today.getMonth()+1}월 ${today.getDate()}일`;
                      const normalCount = sentinelResults.filter(r => r.status === "정상").length;
                    const rows = sentinelResults.map((r, i) => {
                      const isAb = r.status === "비정상";
                      return `<tr style="background:${isAb ? "#FFF0F0" : "#fff"}">
                        <td style="padding:6px 8px;border:1px solid #aaa;text-align:center;font-size:11px">${i+1}</td>
                        <td style="padding:6px 8px;border:1px solid #aaa;font-size:11px;font-weight:500">${r.nm}</td>
                        <td style="padding:6px 8px;border:1px solid #aaa;text-align:center;font-size:11px;font-weight:700;color:${isAb ? "#DC2626" : "#16a34a"}">${r.status}${isAb ? `<br><span style="font-size:9px;font-weight:400">${r.val} / 기준:${r.std}</span>` : ""}</td>
                        <td style="padding:6px 8px;border:1px solid #aaa;font-size:10px">${r.inspStart}<br>~ ${r.inspEnd}</td>
                        <td style="padding:6px 8px;border:1px solid #aaa;font-size:10px;white-space:nowrap">${r.reportedAt}</td>
                      </tr>`;
                    }).join("");
                    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>점검결과서</title>
                    <style>
                      *{margin:0;padding:0;box-sizing:border-box}
                      body{font-family:'Malgun Gothic','Apple SD Gothic Neo',sans-serif;background:#fff;color:#111;padding:24px 28px}
                      @media print{body{padding:16px 20px}@page{size:A4;margin:12mm}}
                      table{width:100%;border-collapse:collapse;margin-bottom:10px}
                      .title{text-align:center;font-size:22px;font-weight:900;letter-spacing:10px;color:#1a3a5c;border-bottom:3px solid #1a3a5c;padding-bottom:8px;margin-bottom:4px}
                      .subtitle{text-align:center;font-size:11px;color:#555;margin-bottom:16px}
                      .sec-hdr{padding:5px 10px;border:1px solid #333;background:#2d5a8e;color:#fff;font-size:11px;font-weight:700;text-align:center;letter-spacing:2px}
                      .th-light{padding:6px 10px;border:1px solid #333;background:#c8d8e8;color:#1a3a5c;font-size:11px;font-weight:700}
                      .td-val{padding:6px 10px;border:1px solid #aaa;font-size:11px;vertical-align:middle}
                      .th-dark{padding:6px 8px;border:1px solid #333;background:#1a3a5c;color:#fff;font-size:11px;font-weight:700;text-align:center}
                      .sign-td{padding:6px 10px;border:1px solid #aaa;text-align:center;height:52px}
                      .sign-label{font-size:10px;color:#888;margin-bottom:6px}
                      .sign-line{border-bottom:1px solid #999;width:60px;margin:0 auto;padding-bottom:2px}
                    </style></head><body>
                    <div class="title">점 검 결 과 서</div>
                    <div class="subtitle">${form.nm || item.resNm} — ${item.kind || "일상점검"} / ${item.sub || ""}</div>
                    <div class="sec-hdr">기본 정보</div>
                    <table><tbody>
                      <tr><td class="th-light" width="18%">대상 자원</td><td class="td-val" width="32%">${item.resNm || "—"}</td><td class="th-light" width="18%">점검표</td><td class="td-val" width="32%">${item.clNm || "—"}</td></tr>
                      <tr><td class="th-light">보고기한</td><td class="td-val">${form.reportDeadlineDate} ${form.reportDeadlineTime}</td><td class="th-light">점검자</td><td class="td-val">${item.insp || "—"}</td></tr>
                      <tr><td class="th-light">점검일</td><td class="td-val">${sentinelResults[0]?.inspStart?.split(" ")[0] || tdStr}</td><td class="th-light">제출일시</td><td class="td-val">${sentinelResults[0]?.reportedAt || "—"}</td></tr>
                    </tbody></table>
                    <div class="sec-hdr">점검 결과 요약</div>
                    <table><tbody>
                      <tr>
                        <td class="th-light" width="18%">총 항목</td><td class="td-val" width="15%" style="text-align:center;font-weight:700">${sentinelResults.length}건</td>
                        <td class="th-light" width="18%">정상</td><td class="td-val" width="15%" style="text-align:center;font-weight:700;color:#16a34a">${normalCount}건</td>
                        <td class="th-light" width="18%">비정상</td><td class="td-val" width="16%" style="text-align:center;font-weight:700;color:${defectCount > 0 ? "#DC2626" : "#16a34a"}">${defectCount}건</td>
                      </tr>
                      <tr><td class="th-light">종합판정</td><td colspan="5" class="td-val" style="font-weight:700;color:${defectCount > 0 ? "#DC2626" : "#16a34a"}">${defectCount > 0 ? `⚠ 비정상 (${defectCount}개 항목 조치 필요)` : "✓ 전체 정상"}</td></tr>
                    </tbody></table>
                    <div class="sec-hdr">항목별 점검결과</div>
                    <table><thead><tr>
                      <th class="th-dark">No</th><th class="th-dark">점검항목</th><th class="th-dark">이상유무</th><th class="th-dark">점검수행기간</th><th class="th-dark">결과보고 시점</th>
                    </tr></thead><tbody>${rows}</tbody></table>
                    <div class="sec-hdr">육안점검 결과</div>
                    <table><tbody>
                      <tr>
                        <td class="th-light" width="18%">점검 결과</td>
                        <td class="td-val" width="32%" style="font-weight:700;color:${eyeResult === "정상" ? "#16a34a" : eyeResult === "비정상" ? "#DC2626" : "#6B7280"}">${eyeResult || "—"}</td>
                        <td class="th-light" width="18%">첨부 사진</td>
                        <td class="td-val" width="32%">${eyePhotos.length > 0 ? `${eyePhotos.length}장` : "없음"}</td>
                      </tr>
                      <tr>
                        <td class="th-light">특이사항</td>
                        <td colspan="3" class="td-val" style="white-space:pre-wrap;line-height:1.7">${eyeNote || "—"}</td>
                      </tr>
                      ${eyePhotos.length > 0 ? `<tr><td class="th-light" style="vertical-align:top">사진</td><td colspan="3" class="td-val"><div style="display:flex;flex-wrap:wrap;gap:6px">${eyePhotos.map(p => `<div style="text-align:center"><img src="${p.url}" style="width:60px;height:60px;object-fit:cover;border-radius:4px;border:1px solid #ddd;display:block"><div style="font-size:8px;color:#888;margin-top:2px;max-width:60px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.name}</div></div>`).join("")}</div></td></tr>` : ""}
                    </tbody></table>
                    <div class="sec-hdr">확인</div>
                    <table><tbody><tr>
                      <td class="sign-td" width="33%"><div class="sign-label">점검자</div><div class="sign-line">&nbsp;</div></td>
                      <td class="sign-td" width="33%"><div class="sign-label">담당자</div><div class="sign-line">&nbsp;</div></td>
                      <td class="sign-td" width="34%"><div class="sign-label">팀장</div><div class="sign-line">&nbsp;</div></td>
                    </tr></tbody></table>
                    <script>window.onload=function(){window.print();setTimeout(function(){window.close()},500)}<\/script>
                    </body></html>`;
                    const w = window.open("", "_blank", "width=800,height=900");
                    if (w) { w.document.write(html); w.document.close(); }
                  }}
                  style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4, border: `1px solid ${C.brd}`, background: "#fff", color: C.txS, cursor: "pointer" }}>
                  <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M7 1v8M4 6l3 3 3-3"/><path d="M1 10v1a2 2 0 002 2h8a2 2 0 002-2v-1"/></svg>
                  다운로드
                </button>
                {/* 미리보기 토글 버튼 */}
                <button
                  onClick={() => setShowPreview(p => !p)}
                  style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", fontSize: 11, fontWeight: 600, borderRadius: 4, border: `1px solid ${showPreview ? C.pri : C.brd}`, background: showPreview ? C.priL : "#fff", color: showPreview ? C.pri : C.txS, cursor: "pointer", transition: "all .2s" }}>
                  {showPreview
                    ? <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="0.5" y="0.5" width="9" height="9" rx="1.5"/><path d="M8 6l5-5M13 5V1h-4"/></svg>
                    : <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="4.5" width="9" height="9" rx="1.5"/><path d="M6 8L1 13M1 9v4h4"/></svg>}
                  {showPreview ? "미리보기 닫기" : "미리보기"}
                </button>
                </>
              )}
            </div>
          </div>

          {!hasResults ? (
            <div style={{ padding: "20px 0", textAlign: "center", fontSize: 12, color: C.txL, background: "#F9FAFC", borderRadius: 8, border: `1px dashed ${C.brd}` }}>
              아직 센티널에서 수행된 점검결과가 없습니다.
            </div>
          ) : (
            <div style={{ border: `1px solid ${C.brd}`, borderRadius: 8, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "#F9FAFC" }}>
                    {["점검항목", "이상유무", "점검수행기간", "결과보고 시점"].map(h => (
                      <th key={h} style={{ padding: "8px 10px", borderBottom: `2px solid ${C.brd}`, textAlign: "left", fontWeight: 600, color: C.txS, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sentinelResults.map((r) => {
                    const isAbnormal = r.status === "비정상";
                    const isPending  = r.status === "대기중";
                    const isRunning  = r.status === "점검중";
                    const rowBg = isAbnormal ? "#FFF8F8" : isRunning ? "#F0F9FF" : "transparent";
                    return (
                      <tr key={r.id} style={{ borderBottom: `1px solid ${C.brd}`, background: rowBg }}>
                        <td style={{ padding: "9px 10px", fontWeight: 500, color: C.txt }}>{r.nm}</td>
                        <td style={{ padding: "9px 10px" }}>
                          {isPending ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600, background: "#F3F4F6", color: "#9CA3AF" }}>
                              — 대기중
                            </span>
                          ) : isRunning ? (
                            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 600, background: "#EFF6FF", color: "#2563EB" }}>
                              <span style={{ width: 7, height: 7, borderRadius: "50%", border: "2px solid #2563EB", borderTopColor: "transparent", display: "inline-block", animation: "spin .7s linear infinite" }} />
                              점검중
                            </span>
                          ) : (
                            <>
                              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 700, background: isAbnormal ? "#FEE2E2" : "#DCFCE7", color: isAbnormal ? "#DC2626" : "#16A34A" }}>
                                {isAbnormal ? "⚠ 비정상" : "✓ 정상"}
                              </span>
                              {isAbnormal && <div style={{ fontSize: 10, color: C.red, marginTop: 2 }}>측정값: {r.val} (기준: {r.std})</div>}
                            </>
                          )}
                        </td>
                        <td style={{ padding: "9px 10px", fontSize: 11, color: C.txS }}>
                          <div>{r.inspStart}</div>
                          <div style={{ color: C.txL }}>~ {r.inspEnd}</div>
                        </td>
                        <td style={{ padding: "9px 10px", fontSize: 11, color: isPending ? C.txL : C.txS, whiteSpace: "nowrap" }}>{r.reportedAt}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ padding: "6px 12px", background: "#F9FAFC", borderTop: `1px solid ${C.brd}`, fontSize: 11, color: C.txL, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span>총 {sentinelResults.length}개 항목</span>
                  <span style={{ color: C.brd }}>|</span>
                  <span>최종 수행: {sentinelResults[sentinelResults.length - 1]?.reportedAt || sentinelResults[sentinelResults.length - 1]?.inspEnd || "—"}</span>
                </span>
                <span>
                  <span style={{ color: "#16a34a", fontWeight: 600 }}>정상 {sentinelResults.filter(r => r.status === "정상").length}</span>
                  {defectCount > 0 && <span style={{ color: C.red, fontWeight: 600, marginLeft: 10 }}>비정상 {defectCount}</span>}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── 육안점검 ── */}
        <div style={{ marginBottom: 18 }}>
          <SecTitle label="육안점검" />

          {/* 육안점검 결과 */}
          <FormRow label="육안점검 결과">
            <div style={{ display: "flex", gap: 8 }}>
              {["정상", "비정상", "해당없음"].map(opt => (
                <label key={opt} style={{ display: "flex", alignItems: "center", gap: 5, cursor: canReport ? "pointer" : "default", fontSize: 12, color: eyeResult === opt ? C.pri : C.txS, fontWeight: eyeResult === opt ? 600 : 400 }}>
                  <input
                    type="radio"
                    name="eyeResult"
                    value={opt}
                    checked={eyeResult === opt}
                    onChange={() => canReport && setEyeResult(opt)}
                    disabled={!canReport}
                    style={{ accentColor: C.pri, cursor: canReport ? "pointer" : "default" }}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </FormRow>

          {/* 특이사항 */}
          <FormRow label="특이사항">
            <textarea
              value={eyeNote}
              onChange={e => canReport && setEyeNote(e.target.value)}
              readOnly={!canReport}
              placeholder={canReport ? "특이사항을 입력하세요..." : ""}
              style={{ ...fInput, height: 72, resize: "vertical", lineHeight: 1.6, fontFamily: "inherit", ...(canReport ? {} : { background: "#F9FAFC", color: C.txt, pointerEvents: "none" }) }}
            />
          </FormRow>

          {/* 사진 첨부 */}
          <div style={{ marginBottom: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.txS, display: "block", marginBottom: 8 }}>사진 첨부</label>

            {/* 썸네일 목록 + 추가 버튼 */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "flex-start" }}>
              {eyePhotos.map((photo, idx) => (
                <div key={idx} style={{ position: "relative", width: 80, height: 80, borderRadius: 6, overflow: "hidden", border: `1px solid ${C.brd}`, flexShrink: 0 }}>
                  <img src={photo.url} alt={photo.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  {canReport && (
                    <button
                      onClick={() => setEyePhotos(p => p.filter((_, i) => i !== idx))}
                      style={{ position: "absolute", top: 2, right: 2, width: 18, height: 18, borderRadius: "50%", background: "rgba(0,0,0,.55)", border: "none", color: "#fff", fontSize: 11, lineHeight: 1, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                      ×
                    </button>
                  )}
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(0,0,0,.45)", padding: "2px 4px", fontSize: 9, color: "#fff", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>{photo.name}</div>
                </div>
              ))}

              {/* 추가 버튼 - canReport일 때만 */}
              {canReport && (
                <label style={{ width: 80, height: 80, borderRadius: 6, border: `2px dashed ${C.brd}`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, cursor: "pointer", background: "#FAFBFC", flexShrink: 0, transition: "border-color .2s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = C.pri}
                  onMouseLeave={e => e.currentTarget.style.borderColor = C.brd}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={e => {
                      const files = Array.from(e.target.files);
                      files.forEach(file => {
                        const reader = new FileReader();
                        reader.onload = ev => setEyePhotos(p => [...p, { url: ev.target.result, name: file.name }]);
                        reader.readAsDataURL(file);
                      });
                      e.target.value = "";
                    }}
                  />
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke={C.txL} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="16" height="13" rx="2"/>
                    <circle cx="10" cy="10.5" r="3"/>
                    <path d="M7 4l1.5-2h3L13 4"/>
                  </svg>
                  <span style={{ fontSize: 10, color: C.txL }}>사진 추가</span>
                </label>
              )}

              {/* 사진 없고 조회만인 경우 */}
              {!canReport && eyePhotos.length === 0 && (
                <div style={{ fontSize: 12, color: C.txL, padding: "10px 0" }}>첨부된 사진이 없습니다.</div>
              )}
            </div>
          </div>
        </div>

        {/* 버튼 영역 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: `1px solid ${C.brd}` }}>
          {/* 좌: 센티널이면 보고 버튼 / 매니저이면 삭제·수정 */}
          <div style={{ display: "flex", gap: 8 }}>
            {canReport ? (
              /* 센티널 전용 - 완료 상태가 아닐 때만 보고 가능 */
              <button
                disabled={item?.st === "완료"}
                onClick={() => setShowReportConfirm(true)}
                style={{ height: 34, padding: "0 16px", fontSize: 12, fontWeight: 600, borderRadius: 4, border: "none", background: item?.st === "완료" ? C.brd : C.sec, color: item?.st === "완료" ? C.txL : "#fff", cursor: item?.st === "완료" ? "not-allowed" : "pointer", opacity: item?.st === "완료" ? 0.5 : 1 }}>
                점검 보고
              </button>
            ) : (
              /* 매니저 전용 - 완료/진행 시 비활성 */
              <>
                <button disabled={isLocked} style={{ height: 34, padding: "0 14px", fontSize: 12, fontWeight: 600, borderRadius: 4, border: `1px solid ${isLocked ? C.brd : "#EF4444"}`, background: "#fff", color: isLocked ? C.txL : "#EF4444", cursor: isLocked ? "not-allowed" : "pointer", opacity: isLocked ? 0.5 : 1 }}>삭제</button>
                <button disabled={isLocked} style={{ height: 34, padding: "0 14px", fontSize: 12, fontWeight: 600, borderRadius: 4, border: `1px solid ${isLocked ? C.brd : C.brdD}`, background: isLocked ? "#F9FAFC" : "#fff", color: isLocked ? C.txL : C.txt, cursor: isLocked ? "not-allowed" : "pointer", opacity: isLocked ? 0.5 : 1 }}>수정</button>
              </>
            )}

          {/* 점검보고 컨펌 모달 */}
          {showReportConfirm && (
            <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ background: "#fff", borderRadius: 10, padding: "28px 32px", width: 340, boxShadow: "0 8px 32px rgba(0,0,0,.18)" }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.txt, marginBottom: 10 }}>점검 보고</div>
                <div style={{ fontSize: 13, color: C.txS, lineHeight: 1.7, marginBottom: 24 }}>점검결과를 보고합니다.</div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <button onClick={() => setShowReportConfirm(false)} style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, borderRadius: 4, border: `1px solid ${C.brd}`, background: "#fff", color: C.txt, cursor: "pointer" }}>아니오</button>
                  <button onClick={() => { setShowReportConfirm(false); onClose(); }} style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, borderRadius: 4, border: "none", background: C.sec, color: "#fff", cursor: "pointer" }}>예</button>
                </div>
              </div>
            </div>
          )}
          </div>
          <Btn onClick={onClose}>닫기</Btn>
        </div>

          </div>{/* 좌 컬럼 끝 */}

          {/* 우: 점검결과 미리보기 컬럼 */}
          {showPreview && (
            <div style={{ flex: 1, minWidth: 0, paddingLeft: 20, overflowY: "auto", maxHeight: "calc(100vh - 160px)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: C.txS }}>점검결과 미리보기</span>
                <span style={{ fontSize: 10, color: C.txL, background: "#F0F5FF", padding: "2px 8px", borderRadius: 10, border: `1px solid ${C.priL}` }}>센티널 수행 결과</span>
              </div>
              <div style={{ border: `1px solid ${C.brd}`, borderRadius: 6, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
                {/* 미리보기 문서 */}
                {(() => {
                  const tbl = { width: "100%", borderCollapse: "collapse" };
                  const th = (extra={}) => ({ padding: "6px 10px", border: "1px solid #333", background: "#1a3a5c", color: "#fff", fontSize: 11, fontWeight: 700, textAlign: "center", ...extra });
                  const thLight = (extra={}) => ({ padding: "6px 10px", border: "1px solid #333", background: "#c8d8e8", color: "#1a3a5c", fontSize: 11, fontWeight: 700, textAlign: "center", ...extra });
                  const td = (extra={}) => ({ padding: "6px 10px", border: "1px solid #aaa", fontSize: 11, verticalAlign: "middle", ...extra });
                  const secHdr = (extra={}) => ({ padding: "5px 10px", border: "1px solid #333", background: "#2d5a8e", color: "#fff", fontSize: 11, fontWeight: 700, textAlign: "center", letterSpacing: 2, ...extra });
                  const today = new Date();
                  const tdStr = `${today.getFullYear()}년 ${today.getMonth()+1}월 ${today.getDate()}일`;
                  return (
                    <div id="daily-result-preview-doc" style={{ fontFamily: "'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif", background: "#fff", padding: "20px 24px", color: "#111" }}>
                      {/* 제목 */}
                      <div style={{ textAlign: "center", marginBottom: 16 }}>
                        <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: 10, color: "#1a3a5c", borderBottom: "3px solid #1a3a5c", paddingBottom: 8, marginBottom: 4 }}>점 검 결 과 서</div>
                        <div style={{ fontSize: 11, color: "#555", marginTop: 4 }}>{form.nm || item.resNm} — {item.kind || "일상점검"} / {item.sub || ""}</div>
                      </div>

                      {/* 기본 정보 */}
                      <div style={secHdr({ marginBottom: 0 })}>기본 정보</div>
                      <table style={{ ...tbl, marginBottom: 10 }}>
                        <tbody>
                          <tr>
                            <td style={thLight({ width: "18%", textAlign: "left" })}>대상 자원</td>
                            <td style={td({ width: "32%" })}>{item.resNm || "—"}</td>
                            <td style={thLight({ width: "18%", textAlign: "left" })}>점검표</td>
                            <td style={td({ width: "32%" })}>{item.clNm || "—"}</td>
                          </tr>
                          <tr>
                            <td style={thLight({ textAlign: "left" })}>보고기한</td>
                            <td style={td()}>{form.reportDeadlineDate} {form.reportDeadlineTime}</td>
                            <td style={thLight({ textAlign: "left" })}>점검자</td>
                            <td style={td()}>{item.insp || "—"}</td>
                          </tr>
                          <tr>
                            <td style={thLight({ textAlign: "left" })}>점검일</td>
                            <td style={td()}>{sentinelResults[0]?.inspStart?.split(" ")[0] || tdStr}</td>
                            <td style={thLight({ textAlign: "left" })}>제출일시</td>
                            <td style={td()}>{sentinelResults[0]?.reportedAt || "—"}</td>
                          </tr>
                        </tbody>
                      </table>

                      {/* 점검 결과 요약 */}
                      <div style={secHdr({ marginBottom: 0 })}>점검 결과 요약</div>
                      <table style={{ ...tbl, marginBottom: 10 }}>
                        <tbody>
                          <tr>
                            <td style={thLight({ width: "18%", textAlign: "left" })}>총 항목</td>
                            <td style={td({ width: "15%", textAlign: "center", fontWeight: 700 })}>{sentinelResults.length}건</td>
                            <td style={thLight({ width: "18%", textAlign: "left" })}>정상</td>
                            <td style={td({ width: "15%", textAlign: "center", fontWeight: 700, color: "#16a34a" })}>{sentinelResults.filter(r=>r.status==="정상").length}건</td>
                            <td style={thLight({ width: "18%", textAlign: "left" })}>비정상</td>
                            <td style={td({ width: "16%", textAlign: "center", fontWeight: 700, color: defectCount > 0 ? "#DC2626" : "#16a34a" })}>{defectCount}건</td>
                          </tr>
                          <tr>
                            <td style={thLight({ textAlign: "left" })}>종합판정</td>
                            <td colSpan={5} style={td({ fontWeight: 700, color: defectCount > 0 ? "#DC2626" : "#16a34a", fontSize: 12 })}>
                              {defectCount > 0 ? `⚠ 비정상 (${defectCount}개 항목 조치 필요)` : "✓ 전체 정상"}
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      {/* 항목별 점검결과 */}
                      <div style={secHdr({ marginBottom: 0 })}>항목별 점검결과</div>
                      <table style={{ ...tbl, marginBottom: 10 }}>
                        <thead>
                          <tr>
                            {["No", "점검항목", "이상유무", "점검수행기간", "결과보고 시점"].map(h => (
                              <th key={h} style={th()}>{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {sentinelResults.map((r, i) => {
                            const isAb = r.status === "비정상";
                            return (
                              <tr key={r.id} style={{ background: isAb ? "#FFF0F0" : "#fff" }}>
                                <td style={td({ textAlign: "center", width: 28 })}>{i+1}</td>
                                <td style={td({ fontWeight: 500 })}>{r.nm}</td>
                                <td style={td({ textAlign: "center", fontWeight: 700, color: isAb ? "#DC2626" : "#16a34a" })}>
                                  {isAb ? "비정상" : "정상"}
                                  {isAb && <div style={{ fontSize: 9, fontWeight: 400, color: "#DC2626" }}>{r.val} / 기준:{r.std}</div>}
                                </td>
                                <td style={td({ fontSize: 10 })}>{r.inspStart}<br/>~ {r.inspEnd}</td>
                                <td style={td({ fontSize: 10, whiteSpace: "nowrap" })}>{r.reportedAt}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      {/* 육안점검 결과 */}
                      <div style={secHdr({ marginBottom: 0 })}>육안점검 결과</div>
                      <table style={{ ...tbl, marginBottom: 10 }}>
                        <tbody>
                          <tr>
                            <td style={thLight({ width: "18%", textAlign: "left" })}>점검 결과</td>
                            <td style={td({ width: "32%" })}>
                              {eyeResult
                                ? <span style={{ fontWeight: 700, color: eyeResult === "정상" ? "#16a34a" : eyeResult === "비정상" ? "#DC2626" : "#6B7280" }}>{eyeResult}</span>
                                : <span style={{ color: "#aaa" }}>—</span>}
                            </td>
                            <td style={thLight({ width: "18%", textAlign: "left" })}>첨부 사진</td>
                            <td style={td({ width: "32%" })}>{eyePhotos.length > 0 ? `${eyePhotos.length}장` : "없음"}</td>
                          </tr>
                          <tr>
                            <td style={thLight({ textAlign: "left" })}>특이사항</td>
                            <td colSpan={3} style={td({ lineHeight: 1.7, whiteSpace: "pre-wrap" })}>{eyeNote || "—"}</td>
                          </tr>
                          {eyePhotos.length > 0 && (
                            <tr>
                              <td style={thLight({ textAlign: "left", verticalAlign: "top" })}>사진</td>
                              <td colSpan={3} style={td()}>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                                  {eyePhotos.map((p, i) => (
                                    <div key={i} style={{ textAlign: "center" }}>
                                      <img src={p.url} alt={p.name} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4, border: "1px solid #ddd", display: "block" }} />
                                      <div style={{ fontSize: 8, color: "#888", marginTop: 2, maxWidth: 60, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.name}</div>
                                    </div>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      {/* 서명란 */}
                      <div style={secHdr({ marginBottom: 0 })}>확인</div>
                      <table style={{ ...tbl, marginBottom: 0 }}>
                        <tbody>
                          <tr>
                            {["점검자", "담당자", "팀장"].map(role => (
                              <td key={role} style={td({ textAlign: "center", height: 48, width: "33%" })}>
                                <div style={{ fontSize: 10, color: "#888", marginBottom: 4 }}>{role}</div>
                                <div style={{ fontSize: 11, borderBottom: "1px solid #999", width: 60, margin: "0 auto", paddingBottom: 2 }}>&nbsp;</div>
                              </td>
                            ))}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}
        </div>{/* 2컬럼 flex 끝 */}
      </>}
    </SidePanel>
  );
};

/* ──── COMMON PANEL: 특별점검 패널 ──── */
const SpecialPanel = ({ open, onClose, item, canReport = false }) => {
  const isNew = !item;
  const emptyForm = {
    st: "예정", inspType: "특별점검", specialKind: "이중화점검", specialId: "",  title: "",
    resources: [], inspectors: [], due: "", planFile: null, planUrl: "",
    registrant: "", regDt: "", purpose: "", content: "",
    execDt: "", submitDt: "", resultContent: "", resultFile: null, reInspYn: "N"
  };
  const [form, setForm] = useState(emptyForm);
  const [showReportConfirm, setShowReportConfirm] = useState(false);
  const [resultForm, setResultForm] = useState({ execDt: "", resultContent: "", reInspYn: "N", eyeNote: "", eyePhotos: [] });

  useEffect(() => {
    if (open && item) setForm({
      ...emptyForm, st: item.st || "예정", specialKind: item.kind || "이중화점검",
      specialId: item.specialId || `SP-${String(item.id || 1).padStart(4, "0")}`,
      title: item.title || "", resources: item.resources || [],
      inspectors: item.inspectors || ["user01"], due: item.due || "",
      registrant: item.user || "관리자", regDt: item.regDt || "2026-02-01 10:00:00",
      purpose: "시스템 안정성 검증", content: "이중화 장비 절체 테스트 및 장애 복구 확인",
      execDt: item.st === "완료" ? "2026-02-15" : "", submitDt: item.st === "완료" ? "2026-02-15 16:30:00" : "",
      resultContent: item.st === "완료" ? "이중화 절체 테스트 완료. 전체 서비스 정상 복구 확인." : ""
    });
    if (open && !item) setForm(emptyForm);
    setResultForm({ execDt: "", resultContent: "", reInspYn: "N", eyeNote: "", eyePhotos: [] });
  }, [open, item]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const setRf = (k, v) => setResultForm(p => ({ ...p, [k]: v }));

  const { editMode, confirmOpen, startEdit, handleDiscard, handleSaveConfirm, handleSave, handleCancel, setConfirmOpen } = useEditPanel(open, onClose);
  const ro = canReport ? true : (!!item && !editMode);
  const roS = ro ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none" } : {};
  const roSel = ro ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none", appearance: "none", backgroundImage: "none", cursor: "default" } : {};
  const isDone = item?.st === "완료";

  return (
    <>
    {!canReport && <UnsavedConfirm open={confirmOpen} onDiscard={handleDiscard} onSave={() => handleSaveConfirm()} />}

    {/* 결과 보고 컨펌 */}
    {showReportConfirm && (
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "#fff", borderRadius: 10, padding: "28px 32px", width: 340, boxShadow: "0 8px 32px rgba(0,0,0,.18)" }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.txt, marginBottom: 10 }}>결과 보고</div>
          <div style={{ fontSize: 13, color: C.txS, lineHeight: 1.7, marginBottom: 24 }}>점검결과를 보고합니다.</div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <button onClick={() => setShowReportConfirm(false)} style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, borderRadius: 4, border: `1px solid ${C.brd}`, background: "#fff", color: C.txt, cursor: "pointer" }}>아니오</button>
            <button onClick={() => { setShowReportConfirm(false); onClose(); }} style={{ padding: "8px 20px", fontSize: 13, fontWeight: 600, borderRadius: 4, border: "none", background: C.sec, color: "#fff", cursor: "pointer" }}>예</button>
          </div>
        </div>
      </div>
    )}

    <SidePanel open={open} onClose={() => (!canReport && editMode) ? setConfirmOpen(true) : onClose()} title={isNew ? "특별점검 추가" : "특별점검 상세"} width={580}>

      {/* 수정/삭제 버튼 - 매니저 전용 */}
      {!canReport && (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginBottom: 16, marginTop: -6 }}>
          {!isNew && <button onClick={() => {}} style={{ padding: "5px 14px", fontSize: 12, fontWeight: 600, border: "1px solid #fca5a5", borderRadius: 6, background: "#fef2f2", color: "#ef4444", cursor: "pointer" }}>삭제</button>}
          {!isNew && ro && <button onClick={startEdit} style={{ padding: "5px 14px", fontSize: 12, fontWeight: 600, border: `1px solid ${C.pri}`, borderRadius: 6, background: C.priL, color: C.pri, cursor: "pointer" }}>수정</button>}
        </div>
      )}

      {/* ── 기본 정보 ── */}
      <div style={{ marginBottom: 18 }}>
        {<SecTitle label="기본 정보" primary />}
        <FormRow label="특별점검 제목" required>
          <input style={{ ...fInput, ...roS }} value={form.title} onChange={e => set("title", e.target.value)} placeholder="특별점검 제목" readOnly={ro} maxLength={100} />
        </FormRow>
        <FormRow label="점검 기한" required>
          <input type="date" style={{ ...fInput, ...roS }} value={form.due} onChange={e => set("due", e.target.value)} readOnly={ro} />
        </FormRow>
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="등록자" half>
            <input style={{ ...fInput, background: "#F9FAFC", pointerEvents: "none" }} value={form.registrant} readOnly />
          </FormRow>
          <FormRow label="등록일" half>
            <input style={{ ...fInput, background: "#F9FAFC", pointerEvents: "none" }} value={form.regDt} readOnly />
          </FormRow>
        </div>
      </div>

      {/* ── 점검자 ── */}
      <div style={{ marginBottom: 18 }}>
        {<SecTitle label="점검자" />}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {form.inspectors.length === 0 && <span style={{ fontSize: 12, color: C.txL }}>점검자가 없습니다.</span>}
          {form.inspectors.map(uid => { const u = USERS.find(x => x.userId === uid); return u ? <span key={uid} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 12, background: C.priL, color: C.priD, fontSize: 12 }}>{u.userNm} ({u.userRole}) {!ro && <span onClick={() => set("inspectors", form.inspectors.filter(x => x !== uid))} style={{ cursor: "pointer" }}>×</span>}</span> : null; })}
        </div>
        {!ro && <select style={{ ...fSelect, maxWidth: 280 }} value="" onChange={e => { if (e.target.value && !form.inspectors.includes(e.target.value)) set("inspectors", [...form.inspectors, e.target.value]); }}>
          <option value="">+ 점검자 추가</option>
          {USERS.filter(u => u.useYn === "Y" && !form.inspectors.includes(u.userId)).map(u => <option key={u.userId} value={u.userId}>{u.userNm} ({u.userRole})</option>)}
        </select>}
      </div>

      {/* ── 점검 상세 ── */}
      <div style={{ marginBottom: 18 }}>
        {<SecTitle label="점검 상세" />}
        <FormRow label="점검 목적">
          <textarea style={{ ...fTextarea, ...(ro ? { ...roS, resize: "none" } : {}) }} value={form.purpose} onChange={e => set("purpose", e.target.value)} placeholder="점검 수행 사유" readOnly={ro} maxLength={500} />
        </FormRow>
        <FormRow label="특별점검 내용">
          <textarea style={{ ...fTextarea, minHeight: 100, ...(ro ? { ...roS, resize: "none" } : {}) }} value={form.content} onChange={e => set("content", e.target.value)} placeholder="점검 상세 내용" readOnly={ro} maxLength={2000} />
        </FormRow>
        <FormRow label="점검계획서">
          {ro ? <span style={{ fontSize: 13, color: C.pri }}>📎 점검계획서_v1.pdf</span> : <input type="file" style={{ fontSize: 12 }} />}
        </FormRow>
      </div>

      {/* ── 점검 결과 (완료 시 - 매니저 조회) ── */}
      {!canReport && isDone && (
        <div style={{ marginBottom: 18 }}>
          {<SecTitle label="점검 결과" />}
          <div style={{ display: "flex", gap: 12 }}>
            <FormRow label="수행 일자" half>
              <input type="date" style={{ ...fInput, ...roS }} value={form.execDt} readOnly />
            </FormRow>
            <FormRow label="제출 일시" half>
              <input style={{ ...fInput, ...roS }} value={form.submitDt} readOnly />
            </FormRow>
          </div>
          <FormRow label="결과 내용">
            <textarea style={{ ...fTextarea, minHeight: 100, ...roS, resize: "none" }} value={form.resultContent} readOnly maxLength={2000} />
          </FormRow>
          <FormRow label="결과 첨부">
            <span style={{ fontSize: 13, color: C.pri }}>📎 결과보고서.pdf</span>
          </FormRow>
          <FormRow label="재점검 여부">
            <RoSelect readOnly style={{ ...fSelect, ...roSel }} value={form.reInspYn}><option value="N">No</option><option value="Y">Yes</option></RoSelect>
          </FormRow>
        </div>
      )}

      {/* ── 결과 보고 (센티널 전용) ── */}
      {canReport && (
        <div style={{ marginBottom: 18 }}>
          <SecTitle label="결과 보고" />
          <FormRow label="수행 일자" required>
            <input type="date" style={{ ...fInput }} value={resultForm.execDt} onChange={e => setRf("execDt", e.target.value)} />
          </FormRow>
          <FormRow label="결과 내용" required>
            <textarea
              style={{ ...fTextarea, minHeight: 100 }}
              value={resultForm.resultContent}
              onChange={e => setRf("resultContent", e.target.value)}
              placeholder="점검 결과를 상세히 기술하세요..."
              maxLength={2000}
            />
          </FormRow>
          <FormRow label="특이사항">
            <textarea
              style={{ ...fTextarea }}
              value={resultForm.eyeNote}
              onChange={e => setRf("eyeNote", e.target.value)}
              placeholder="특이사항을 입력하세요..."
              maxLength={500}
            />
          </FormRow>
          <FormRow label="결과 첨부">
            <input type="file" style={{ fontSize: 12 }} />
          </FormRow>
        </div>
      )}

      {/* 하단 버튼 */}
      {canReport ? (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: `1px solid ${C.brd}` }}>
          <button
            disabled={isDone}
            onClick={() => setShowReportConfirm(true)}
            style={{ height: 34, padding: "0 18px", fontSize: 12, fontWeight: 600, borderRadius: 4, border: "none", background: isDone ? C.brd : C.sec, color: isDone ? C.txL : "#fff", cursor: isDone ? "not-allowed" : "pointer", opacity: isDone ? 0.5 : 1 }}>
            결과 보고
          </button>
          <Btn onClick={onClose}>닫기</Btn>
        </div>
      ) : (isNew || editMode)
        ? <PanelFooter onCancel={handleCancel} onSave={handleSave} saveLabel={isNew ? "등록" : "저장"} />
        : <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 16, borderTop: `1px solid ${C.brd}` }}><Btn onClick={onClose}>닫기</Btn></div>
      }
    </SidePanel>
    </>
  );
};

/* ──── COMMON PANEL: 정기점검 추가 ──── */
const SchedulePanel = ({ open, onClose, item }) => {
  const isNew = !item;
  const { editMode, confirmOpen, startEdit, handleDiscard, handleSaveConfirm, handleSave, handleCancel, setConfirmOpen } = useEditPanel(open, onClose);
  const ro = !!item && !editMode;
  const _freqMap = { "매일": "DAILY", "매주 월,수,금": "WEEKLY", "매주 화,목": "WEEKLY", "매주 수": "WEEKLY", "매월 1일": "MONTHLY", "매월 10일": "MONTHLY", "매월 15일": "MONTHLY" };
  const emptyForm = {
    nm: "", st: "사용", clId: "", sysId: "", resources: [],
    _resCat: "", _resSearch: "",
    freq: "DAILY", interval: 1, weekDays: [1,2,3,4,5],
    monthlyDays: [1],
    startDt: "",
    inspTimeFrom: "09:00", inspTimeTo: "18:00",
    reportTimeFrom: "09:00", reportTimeTo: "18:00",
    autoRunTime: "06:00", reportDeadline: "18:00",
    alertYn: "Y", priority: 1,
    excludeDates: [], excludeInput: "",
    lastRunDt: "", nextRunDt: ""
  };
  const [form, setForm] = useState(emptyForm);
  useEffect(() => {
    if (open && item) {
      const sid = SYS.find(s => s.nm === item.sysNm)?.id || "";
      const cid = CL.find(c => c.nm === item.clNm)?.id || "";
      const resIds = RES.filter(r => r.sysId === sid).slice(0, item.resCnt).map(r => r.id);
      setForm({
        ...emptyForm, nm: item.nm, st: item.useYn === "Y" ? "사용" : "미사용", sysId: sid, clId: cid,
        freq: _freqMap[item.freq] || "DAILY", interval: 1, startDt: "2026-01-01",
        resources: resIds, lastRunDt: item.last || "", nextRunDt: item.next || "", priority: 1
      });
    }
    if (open && !item) setForm(emptyForm);
  }, [open, item]);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggleDay = d => setForm(p => ({ ...p, weekDays: p.weekDays.includes(d) ? p.weekDays.filter(x => x !== d) : [...p.weekDays, d] }));
  const roS = ro ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none" } : {};
  const roSel = ro ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none", appearance: "none", backgroundImage: "none", cursor: "default" } : {};

  const addExcludeDate = () => {
    if (form.excludeInput && !form.excludeDates.includes(form.excludeInput)) {
      set("excludeDates", [...form.excludeDates, form.excludeInput].sort());
      set("excludeInput", "");
    }
  };

  return (
    <>
    <SidePanel open={open} onClose={() => editMode ? setConfirmOpen(true) : onClose()} title={ro ? "정기점검 상세" : "정기점검 추가"} width={580}>
      {/* 우측 상단 액션 버튼 */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginBottom: 16, marginTop: -6 }}>
        {ro && <button onClick={() => {}} style={{ padding: "5px 14px", fontSize: 12, fontWeight: 600, border: "1px solid #fca5a5", borderRadius: 6, background: "#fef2f2", color: "#ef4444", cursor: "pointer" }}>삭제</button>}
        {ro && <button onClick={startEdit} style={{ padding: "5px 14px", fontSize: 12, fontWeight: 600, border: `1px solid ${C.pri}`, borderRadius: 6, background: C.priL, color: C.pri, cursor: "pointer" }}>수정</button>}
      </div>
      {/* ── 스케줄 기본 정보 ── */}
      <div style={{ marginBottom: 18 }}>
        {<SecTitle label="스케줄 정보" primary />}
        <FormRow label="스케줄 명" required>
          <input style={{ ...fInput, ...roS }} value={form.nm} onChange={e => set("nm", e.target.value)} placeholder="스케줄 이름" readOnly={ro} maxLength={100} />
        </FormRow>

        {/* 대상 자원 */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.txS }}>
              대상 자원 {!ro && <span style={{ color: "#ef4444" }}>*</span>}
            </label>
            <span style={{ fontSize: 11, color: C.txL }}>{form.resources.length}개 {ro ? "연결됨" : "선택됨"}</span>
          </div>

          {/* 선택된 자원 태그: 자원명(점검표명) */}
          {form.resources.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
              {form.resources.map(rid => {
                const r = RES.find(x => x.id === rid);
                if (!r) return null;
                const cl = CL.find(c => c.sub === r.mid);
                return (
                  <span key={rid} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 10, background: C.priL, color: C.priD, fontSize: 11, fontWeight: 600 }}>
                    {r.nm}<span style={{ fontWeight: 400, color: C.pri }}>({cl ? cl.nm : "—"})</span>
                    {!ro && <span onClick={() => set("resources", form.resources.filter(x => x !== rid))} style={{ cursor: "pointer", fontSize: 13, lineHeight: 1 }}>×</span>}
                  </span>
                );
              })}
              {!ro && form.resources.length > 1 && <span onClick={() => set("resources", [])} style={{ fontSize: 11, color: C.red, cursor: "pointer", padding: "3px 6px" }}>전체 해제</span>}
            </div>
          )}

          {/* 상세 보기(ro) */}
          {ro && form.resources.length === 0 && (
            <div style={{ padding: "14px 12px", border: `1px solid ${C.brd}`, borderRadius: 6, fontSize: 12, color: C.txL, textAlign: "center" }}>
              연결된 자원이 없습니다.
            </div>
          )}

          {/* 편집/신규: 검색 + 필터로 자원 추가 */}
          {!ro && (() => {
            const sysRes = form.sysId ? RES.filter(r => r.sysId === form.sysId) : RES;
            const cats = Array.from(new Set(sysRes.map(r => r.mid))).sort();
            const catVal = form._resCat || "";
            const searchVal = form._resSearch || "";
            const availRes = sysRes.filter(r => {
              if (form.resources.includes(r.id)) return false;
              if (catVal && r.mid !== catVal) return false;
              if (searchVal && !r.nm.toLowerCase().includes(searchVal.toLowerCase()) && !(r.ip || "").includes(searchVal)) return false;
              return true;
            });
            return (
              <div style={{ border: `1px solid ${C.brd}`, borderRadius: 8, overflow: "hidden" }}>
                {/* 필터 영역 */}
                <div style={{ padding: "8px 10px", background: "#F9FAFC", display: "flex", gap: 6, borderBottom: `1px solid ${C.brd}`, flexWrap: "wrap" }}>
                  <select style={{ padding: "4px 8px", fontSize: 11, border: `1px solid ${C.brd}`, borderRadius: 4, background: ro ? "#F9FAFC" : "#fff", flex: "0 0 auto", minWidth: 100, pointerEvents: ro ? "none" : "auto" }}
                    value={form.sysId} onChange={e => { set("sysId", e.target.value); set("resources", []); set("_resCat", ""); set("_resSearch", ""); }}>
                    <option value="">전체 시스템</option>
                    {SYS.map(s => <option key={s.id} value={s.id}>{s.nm}</option>)}
                  </select>
                  <select style={{ padding: "4px 8px", fontSize: 11, border: `1px solid ${C.brd}`, borderRadius: 4, background: "#fff", flex: "0 0 auto", minWidth: 80 }}
                    value={catVal} onChange={e => set("_resCat", e.target.value)}>
                    <option value="">전체 분류</option>
                    {cats.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div style={{ position: "relative", flex: 1, minWidth: 120 }}>
                    <input style={{ width: "100%", padding: "4px 8px 4px 26px", fontSize: 11, border: `1px solid ${C.brd}`, borderRadius: 4, outline: "none", boxSizing: "border-box" }}
                      placeholder="자원명 또는 IP로 검색..." value={searchVal} onChange={e => set("_resSearch", e.target.value)} />
                    <span style={{ position: "absolute", left: 7, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><Ic n="search" s={12} c={C.txL} /></span>
                    {searchVal && <span onClick={() => set("_resSearch", "")} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 13, color: C.txL, lineHeight: 1 }}>×</span>}
                  </div>
                </div>
                {/* 자원 리스트 */}
                <div style={{ maxHeight: 200, overflowY: "auto" }}>
                  {availRes.length === 0 && <div style={{ padding: 14, textAlign: "center", fontSize: 11, color: C.txL }}>{searchVal || catVal || form.sysId ? "조건에 맞는 자원이 없습니다." : "추가 가능한 자원이 없습니다."}</div>}
                  {availRes.map(r => {
                    const cl = CL.find(c => c.sub === r.mid);
                    const disabled = !cl;
                    return (
                      <div key={r.id}
                        onClick={() => !disabled && set("resources", [...form.resources, r.id])}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderBottom: `1px solid ${C.brd}`, cursor: disabled ? "not-allowed" : "pointer", fontSize: 12, opacity: disabled ? 0.5 : 1, background: disabled ? "#FAFAFA" : "" }}
                        onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = "#f0fdf4"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = disabled ? "#FAFAFA" : ""; }}>
                        <span style={{ color: disabled ? C.txL : C.pri, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>+</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: disabled ? C.txL : C.txt }}>{r.nm}</div>
                          <div style={{ fontSize: 10, color: C.txL, marginTop: 1 }}>{r.mid} · {r.small || "—"} · {r.ip || "—"}</div>
                        </div>
                        <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 8, fontWeight: 600, flexShrink: 0, background: cl ? "#dcfce7" : "#FEF2F2", color: cl ? "#166534" : "#DC2626" }}>
                          {cl ? cl.nm : "점검표 없음"}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {availRes.length > 0 && <div style={{ padding: "4px 12px", fontSize: 10, color: C.txL, textAlign: "center", background: "#F9FAFC", borderTop: `1px solid ${C.brd}` }}>{availRes.length}개 추가 가능</div>}
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── 반복 설정 ── */}
      <div style={{ marginBottom: 18 }}>
        {<SecTitle label="반복 설정" />}

        {/* 시작일 */}
        <FormRow label="시작일" required>
          <input type="date" style={{ ...fInput, ...roS }} value={form.startDt} onChange={e => set("startDt", e.target.value)} readOnly={ro} />
        </FormRow>

        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: C.txS, display: "block", marginBottom: 6 }}>반복 간격</label>

          {/* 1행: 숫자 + 단위 */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: form.freq !== "DAILY" ? 10 : 4 }}>
            <select
              style={{ padding: "6px 10px", fontSize: 13, border: `1px solid ${C.brd}`, borderRadius: 6, background: ro ? "#F9FAFC" : "#fff", color: C.txt, cursor: ro ? "default" : "pointer", pointerEvents: ro ? "none" : "auto", outline: "none", minWidth: 60 }}
              value={form.interval}
              onChange={e => set("interval", +e.target.value)}>
              {Array.from({ length: 30 }, (_, i) => i + 1).map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <select
              style={{ padding: "6px 10px", fontSize: 13, border: `1px solid ${C.brd}`, borderRadius: 6, background: ro ? "#F9FAFC" : "#fff", color: C.txt, cursor: ro ? "default" : "pointer", pointerEvents: ro ? "none" : "auto", outline: "none", minWidth: 60 }}
              value={form.freq}
              onChange={e => set("freq", e.target.value)}>
              <option value="DAILY">일</option>
              <option value="WEEKLY">주</option>
              <option value="MONTHLY">월</option>
            </select>
          </div>

          {/* 2행: 주 — 요일 원형 토글 */}
          {form.freq === "WEEKLY" && (
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
              {["월","화","수","목","금","토","일"].map((d, i) => {
                const active = form.weekDays.includes(i);
                return (
                  <span key={d}
                    onClick={() => !ro && toggleDay(i)}
                    style={{
                      width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: active ? 700 : 400, cursor: ro ? "default" : "pointer",
                      border: `1.5px solid ${active ? C.pri : C.brd}`,
                      background: active ? C.pri : "#fff",
                      color: active ? "#fff" : C.txS,
                      transition: "all .3s", userSelect: "none"
                    }}>
                    {d}
                  </span>
                );
              })}
            </div>
          )}

          {/* 2행: 월 — 날짜 다중 선택 (1~31 토글, 중복 가능) */}
          {form.freq === "MONTHLY" && (() => {
            const toggleMonthDay = d => {
              const cur = form.monthlyDays || [];
              // 중복 허용: 이미 있으면 제거(토글), 없으면 추가
              if (cur.includes(d)) set("monthlyDays", cur.filter(x => x !== d).sort((a,b)=>a-b));
              else set("monthlyDays", [...cur, d].sort((a,b)=>a-b));
            };
            const days = form.monthlyDays || [];
            return (
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontSize: 11, color: C.txL, marginBottom: 6 }}>점검할 날짜를 선택하세요 (복수 선택 가능)</div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 34px)", gap: 4 }}>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(d => {
                    const active = days.includes(d);
                    return (
                      <span key={d}
                        onClick={() => !ro && toggleMonthDay(d)}
                        style={{
                          width: 34, height: 34, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: active ? 700 : 400, cursor: ro ? "default" : "pointer",
                          border: `1.5px solid ${active ? C.pri : C.brd}`,
                          background: active ? C.pri : "#fff",
                          color: active ? "#fff" : C.txS,
                          transition: "all .3s", userSelect: "none"
                        }}>
                        {d}
                      </span>
                    );
                  })}
                </div>
                {days.length > 0 && (
                  <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4 }}>
                    {days.map(d => (
                      <span key={d} style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", borderRadius: 10, background: C.priL, color: C.priD, fontSize: 11, fontWeight: 600 }}>
                        {d}일
                        {!ro && <span onClick={() => toggleMonthDay(d)} style={{ cursor: "pointer", fontSize: 12, lineHeight: 1 }}>×</span>}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* 스케줄 요약 문구 */}
          {(() => {
            const dayNames = ["월","화","수","목","금","토","일"];
            let summary = "";
            if (form.freq === "DAILY") {
              summary = form.interval === 1 ? "매일 발생" : `${form.interval}일마다 발생`;
            } else if (form.freq === "WEEKLY") {
              const selDays = form.weekDays.map(i => dayNames[i]).join(", ");
              const prefix = form.interval === 1 ? "매주" : `${form.interval}주마다`;
              summary = selDays ? `${prefix} ${selDays}요일에 발생` : `${prefix} 발생 (요일 미선택)`;
            } else if (form.freq === "MONTHLY") {
              const prefix = form.interval === 1 ? "매월" : `${form.interval}개월마다`;
              const ds = (form.monthlyDays || []);
              summary = ds.length === 0
                ? `${prefix} 발생 (날짜 미선택)`
                : `${prefix} ${ds.map(d => d + "일").join(", ")}에 발생`;
            }
            return (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 8,
                background: "#F0F5FF", border: `1px solid ${C.priL}`, marginTop: 4 }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 1.5A5.5 5.5 0 1 0 7 12.5 5.5 5.5 0 0 0 7 1.5zm.5 8H6.5V6.5h1V9.5zm0-4H6.5v-1h1v1z" fill={C.pri}/>
                </svg>
                <span style={{ fontSize: 12, color: C.pri, fontWeight: 600 }}>{summary}</span>
              </div>
            );
          })()}
        </div>

        {/* 자동점검 실행시간 */}
        <FormRow label="자동점검 실행시간" required>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input type="time" style={{ ...fInput, flex: 1, ...roS }} value={form.autoRunTime} onChange={e => set("autoRunTime", e.target.value)} readOnly={ro} />
          </div>
          <div style={{ fontSize: 10, color: C.txL, marginTop: 4 }}>설정된 시간에 자동점검 배치가 실행되며 점검 보고서가 자동 생성됩니다.</div>
        </FormRow>

        {/* 보고기한 시간 */}
        <FormRow label="보고기한 시간" required>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <input type="time" style={{ ...fInput, flex: 1, ...roS }} value={form.reportDeadline} onChange={e => set("reportDeadline", e.target.value)} readOnly={ro} />
          </div>
          <div style={{ fontSize: 10, color: C.txL, marginTop: 4 }}>해당 시간까지 보고를 완료하지 않으면 "지연" 상태로 전환됩니다.</div>
        </FormRow>
      </div>

      {/* ── 제외 일정 ── */}
      <div style={{ marginBottom: 18 }}>
        {<SecTitle label="제외 일정" />}
        <FormRow label="제외 날짜">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
            {form.excludeDates.length === 0 && <span style={{ fontSize: 12, color: C.txL }}>제외 일정이 없습니다.</span>}
            {form.excludeDates.map(dt => (
              <span key={dt} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 8px", borderRadius: 10, background: "#fee2e2", color: "#991b1b", fontSize: 11 }}>
                {dt}
                {!ro && <span onClick={() => set("excludeDates", form.excludeDates.filter(x => x !== dt))} style={{ cursor: "pointer", fontSize: 13 }}>×</span>}
              </span>
            ))}
          </div>
          {!ro && <div style={{ display: "flex", gap: 6 }}>
            <input type="date" style={{ ...fInput, flex: 1 }} value={form.excludeInput} onChange={e => set("excludeInput", e.target.value)} />
            <Btn onClick={addExcludeDate}>추가</Btn>
          </div>}
        </FormRow>
      </div>
      {ro && <div style={{ marginBottom: 18 }}>
        {<SecTitle label="수행 이력" />}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="마지막 수행 일시" half>
            <input style={{ ...fInput, ...roS }} value={form.lastRunDt || "—"} readOnly />
          </FormRow>
          <FormRow label="다음 수행 예정일" half>
            <input style={{ ...fInput, ...roS }} value={form.nextRunDt || "—"} readOnly />
          </FormRow>
        </div>
      </div>}

      {/* 하단 버튼 */}
      {(isNew || editMode) && <PanelFooter onCancel={handleCancel} onSave={handleSave} saveLabel={isNew ? "등록" : "저장"} />}
      {ro && <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 16, borderTop: `1px solid ${C.brd}` }}><Btn onClick={onClose}>닫기</Btn></div>}
    </SidePanel>
    <UnsavedConfirm open={confirmOpen} onDiscard={handleDiscard} onSave={() => handleSaveConfirm()} />
    </>
  );
};
/* ──── 일상점검 등록 패널 ──── */
const DailyRequestPanel = ({ open, onClose }) => {
  const { editMode, confirmOpen, handleDiscard, handleSaveConfirm, handleSave, handleCancel, setConfirmOpen } = useEditPanel(open, onClose);
  const emptyForm = {
    nm: "", sysId: "", resources: [], _resCat: "", _resSearch: "",
    reportDeadlineDate: "", reportDeadlineTime: "18:00",
    st: "사용", priority: 1, alertYn: "Y"
  };
  const [form, setForm] = useState(emptyForm);
  useEffect(() => { if (open) setForm(emptyForm); }, [open]);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const roS = {};
  return (
    <>
    <SidePanel open={open} onClose={() => confirmOpen ? setConfirmOpen(true) : onClose()} title="일상점검 등록" width={580}>
      {/* ── 점검 정보 ── */}
      <div style={{ marginBottom: 18 }}>
        {<SecTitle label="점검 정보" primary />}
        <FormRow label="점검 명" required>
          <input style={{ ...fInput }} value={form.nm} onChange={e => set("nm", e.target.value)} placeholder="점검 이름을 입력하세요" maxLength={100} />
        </FormRow>

        {/* 대상 자원 */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
            <label style={{ fontSize: 12, fontWeight: 600, color: C.txS }}>
              대상 자원 <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <span style={{ fontSize: 11, color: C.txL }}>{form.resources.length}개 선택됨</span>
          </div>

          {/* 선택된 자원 태그 */}
          {form.resources.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 8 }}>
              {form.resources.map(rid => {
                const r = RES.find(x => x.id === rid);
                if (!r) return null;
                const cl = CL.find(c => c.sub === r.mid);
                return (
                  <span key={rid} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 10, background: C.priL, color: C.priD, fontSize: 11, fontWeight: 600 }}>
                    {r.nm}<span style={{ fontWeight: 400, color: C.pri }}>({cl ? cl.nm : "\u2014"})</span>
                    <span onClick={() => set("resources", form.resources.filter(x => x !== rid))} style={{ cursor: "pointer", fontSize: 13, lineHeight: 1 }}>\u00d7</span>
                  </span>
                );
              })}
              {form.resources.length > 1 && <span onClick={() => set("resources", [])} style={{ fontSize: 11, color: C.red, cursor: "pointer", padding: "3px 6px" }}>전체 해제</span>}
            </div>
          )}

          {/* 자원 검색/추가 */}
          {(() => {
            const sysRes = form.sysId ? RES.filter(r => r.sysId === form.sysId) : RES;
            const cats = Array.from(new Set(sysRes.map(r => r.mid))).sort();
            const catVal = form._resCat || "";
            const searchVal = form._resSearch || "";
            const availRes = sysRes.filter(r => {
              if (form.resources.includes(r.id)) return false;
              if (catVal && r.mid !== catVal) return false;
              if (searchVal && !r.nm.toLowerCase().includes(searchVal.toLowerCase()) && !(r.ip || "").includes(searchVal)) return false;
              return true;
            });
            return (
              <div style={{ border: `1px solid ${C.brd}`, borderRadius: 8, overflow: "hidden" }}>
                <div style={{ padding: "8px 10px", background: "#F9FAFC", display: "flex", gap: 6, borderBottom: `1px solid ${C.brd}`, flexWrap: "wrap" }}>
                  <select style={{ padding: "4px 8px", fontSize: 11, border: `1px solid ${C.brd}`, borderRadius: 4, background: "#fff", flex: "0 0 auto", minWidth: 100 }}
                    value={form.sysId} onChange={e => { set("sysId", e.target.value); set("resources", []); set("_resCat", ""); set("_resSearch", ""); }}>
                    <option value="">전체 시스템</option>
                    {SYS.map(s => <option key={s.id} value={s.id}>{s.nm}</option>)}
                  </select>
                  <select style={{ padding: "4px 8px", fontSize: 11, border: `1px solid ${C.brd}`, borderRadius: 4, background: "#fff", flex: "0 0 auto", minWidth: 80 }}
                    value={catVal} onChange={e => set("_resCat", e.target.value)}>
                    <option value="">전체 분류</option>
                    {cats.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div style={{ position: "relative", flex: 1, minWidth: 120 }}>
                    <input style={{ width: "100%", padding: "4px 8px 4px 26px", fontSize: 11, border: `1px solid ${C.brd}`, borderRadius: 4, outline: "none", boxSizing: "border-box" }}
                      placeholder="자원명 또는 IP로 검색..." value={searchVal} onChange={e => set("_resSearch", e.target.value)} />
                    <span style={{ position: "absolute", left: 7, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><Ic n="search" s={12} c={C.txL} /></span>
                    {searchVal && <span onClick={() => set("_resSearch", "")} style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 13, color: C.txL, lineHeight: 1 }}>\u00d7</span>}
                  </div>
                </div>
                <div style={{ maxHeight: 200, overflowY: "auto" }}>
                  {availRes.length === 0 && <div style={{ padding: 14, textAlign: "center", fontSize: 11, color: C.txL }}>{searchVal || catVal || form.sysId ? "조건에 맞는 자원이 없습니다." : "추가 가능한 자원이 없습니다."}</div>}
                  {availRes.map(r => {
                    const cl = CL.find(c => c.sub === r.mid);
                    const disabled = !cl;
                    return (
                      <div key={r.id}
                        onClick={() => !disabled && set("resources", [...form.resources, r.id])}
                        style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 12px", borderBottom: `1px solid ${C.brd}`, cursor: disabled ? "not-allowed" : "pointer", fontSize: 12, opacity: disabled ? 0.5 : 1, background: disabled ? "#FAFAFA" : "" }}
                        onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = "#f0fdf4"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = disabled ? "#FAFAFA" : ""; }}>
                        <span style={{ color: disabled ? C.txL : C.pri, fontWeight: 700, fontSize: 14, flexShrink: 0 }}>+</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: disabled ? C.txL : C.txt }}>{r.nm}</div>
                          <div style={{ fontSize: 10, color: C.txL, marginTop: 1 }}>{r.mid} \u00b7 {r.small || "\u2014"} \u00b7 {r.ip || "\u2014"}</div>
                        </div>
                        <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 8, fontWeight: 600, flexShrink: 0, background: cl ? "#dcfce7" : "#FEF2F2", color: cl ? "#166534" : "#DC2626" }}>
                          {cl ? cl.nm : "점검표 없음"}
                        </span>
                      </div>
                    );
                  })}
                </div>
                {availRes.length > 0 && <div style={{ padding: "4px 12px", fontSize: 10, color: C.txL, textAlign: "center", background: "#F9FAFC", borderTop: `1px solid ${C.brd}` }}>{availRes.length}개 추가 가능</div>}
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── 보고기한 ── */}
      <div style={{ marginBottom: 18 }}>
        {<SecTitle label="보고기한" />}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="보고기한 날짜" required half>
            <input type="date" style={{ ...fInput }} value={form.reportDeadlineDate} onChange={e => set("reportDeadlineDate", e.target.value)} />
          </FormRow>
          <FormRow label="보고기한 시간" required half>
            <input type="time" style={{ ...fInput }} value={form.reportDeadlineTime} onChange={e => set("reportDeadlineTime", e.target.value)} />
          </FormRow>
        </div>
        <div style={{ fontSize: 10, color: C.txL, marginTop: -4, marginBottom: 4 }}>해당 시간까지 보고를 완료하지 않으면 "지연" 상태로 전환됩니다.</div>
      </div>

      {/* 하단 버튼 */}
      <PanelFooter onCancel={() => onClose()} onSave={handleSave} saveLabel="등록" />
    </SidePanel>
    <UnsavedConfirm open={confirmOpen} onDiscard={handleDiscard} onSave={() => handleSaveConfirm()} />
    </>
  );
};

/* ──── COMMON PANEL: 공지사항 패널 ──── */
const NoticePanel = ({ open, onClose, item }) => {
  const isNew = !item;
  const emptyForm = { st: "사용", title: "", content: "", scope: "전체", startDt: "", endDt: "", registrant: "", regDt: "" };
  const [form, setForm] = useState(emptyForm);
  useEffect(() => {
    if (open && item) setForm({ st: "사용", title: item.title, content: "안녕하세요.\n\n" + item.title + " 관련 내용입니다.\n\n자세한 사항은 첨부 파일을 참고해 주세요.\n\n감사합니다.", scope: "전체", startDt: item.dt + "T00:00", endDt: "", registrant: item.user, regDt: item.dt + " 09:00:00" });
    if (open && !item) setForm(emptyForm);
  }, [open, item]);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const { editMode, confirmOpen, startEdit, handleDiscard, handleSaveConfirm, handleSave, handleCancel, setConfirmOpen } = useEditPanel(open, onClose);
  const ro = !!item && !editMode;
  const roS = ro ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none" } : {};
  const roSel = ro ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none", appearance: "none", backgroundImage: "none", cursor: "default" } : {};

  return (
    <>
    <SidePanel open={open} onClose={() => editMode ? setConfirmOpen(true) : onClose()} title={isNew ? "공지사항 등록" : "공지사항 상세"} width={580}>
      {/* 우측 상단 액션 버튼 */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginBottom: 16, marginTop: -6 }}>
        {!isNew && <button onClick={() => {}} style={{ padding: "5px 14px", fontSize: 12, fontWeight: 600, border: "1px solid #fca5a5", borderRadius: 6, background: "#fef2f2", color: "#ef4444", cursor: "pointer" }}>삭제</button>}
        {!isNew && ro && <button onClick={startEdit} style={{ padding: "5px 14px", fontSize: 12, fontWeight: 600, border: `1px solid ${C.pri}`, borderRadius: 6, background: C.priL, color: C.pri, cursor: "pointer" }}>수정</button>}
      </div>
      <div style={{ marginBottom: 18 }}>
        {<SecTitle label="공지사항 정보" primary />}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="상태" half>
            <RoSelect readOnly={ro} style={{ ...fSelect, ...roSel }} value={form.st} onChange={e => set("st", e.target.value)}>
              <option value="사용">사용</option><option value="미사용">미사용</option>
            </RoSelect>
          </FormRow>
          <FormRow label="공지 범위" half>
            <RoSelect readOnly={ro} style={{ ...fSelect, ...roSel }} value={form.scope} onChange={e => set("scope", e.target.value)}>
              {["전체","매니저","센티널"].map(s => <option key={s} value={s}>{s}</option>)}
            </RoSelect>
          </FormRow>
        </div>
        <FormRow label="제목" required>
          <input style={{ ...fInput, ...roS }} value={form.title} onChange={e => set("title", e.target.value)} placeholder="공지사항 제목" readOnly={ro} maxLength={150} />
        </FormRow>
        <FormRow label="내용">
          <textarea style={{ ...fTextarea, minHeight: 200, ...(ro ? { ...roS, resize: "none" } : {}) }} value={form.content} onChange={e => set("content", e.target.value)} placeholder="공지사항 내용을 입력하세요" readOnly={ro} maxLength={4000} />
        </FormRow>
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="게시 시작일" half>
            <input type="datetime-local" style={{ ...fInput, ...roS }} value={form.startDt} onChange={e => set("startDt", e.target.value)} readOnly={ro} />
          </FormRow>
          <FormRow label="게시 종료일" half>
            <input type="datetime-local" style={{ ...fInput, ...roS }} value={form.endDt} onChange={e => set("endDt", e.target.value)} readOnly={ro} />
          </FormRow>
        </div>
        <FormRow label="첨부파일">
          {ro ? <span style={{ fontSize: 12, color: C.txL }}>📎 첨부파일 없음</span> : <input type="file" style={{ fontSize: 12 }} multiple />}
        </FormRow>
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="등록자" half>
            <input style={{ ...fInput, background: "#F9FAFC", pointerEvents: "none" }} value={form.registrant} readOnly />
          </FormRow>
          <FormRow label="등록일" half>
            <input style={{ ...fInput, background: "#F9FAFC", pointerEvents: "none" }} value={form.regDt} readOnly />
          </FormRow>
        </div>
        {ro && <div style={{ fontSize: 12, color: C.txS, marginTop: 4 }}>조회수: {item.views}</div>}
      </div>
      {(isNew || editMode) && <PanelFooter onCancel={handleCancel} onSave={handleSave} saveLabel={isNew ? "등록" : "저장"} />}
      {ro && <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 16, borderTop: `1px solid ${C.brd}` }}><Btn onClick={onClose}>닫기</Btn></div>}
    </SidePanel>
    <UnsavedConfirm open={confirmOpen} onDiscard={handleDiscard} onSave={() => handleSaveConfirm()} />
    </>
  );
};

/* ── 정보시스템 상세/수정 사이드패널 ── */
const SystemDetailPanel = ({ open, onClose, system, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [form, setForm] = useState({});
  const systemTypeOptions = ["업무", "서비스", "솔루션", "기타"];
  const mgmtOrgOptions = ["내부", "외부(업체)", "IT운영팀", "경영지원팀", "정보보안팀"];

  useEffect(() => {
    if (system) {
      setForm({ nm: system.nm || "", type: system.type || "", org: system.org || "", useYn: system.useYn || "Y", memo: system.memo || "", managerNm: system.managerNm || "", managerPhone: system.managerPhone || "" });
      setEditing(false);
    }
  }, [system]);

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const ro = !editing;
  const roS = ro ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none", cursor: "default" } : {};
  const roSel = ro ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none", cursor: "default", appearance: "none", WebkitAppearance: "none", MozAppearance: "none", backgroundImage: "none" } : {};

  return (
    <>
    <UnsavedConfirm open={confirmOpen} onDiscard={() => { setConfirmOpen(false); setEditing(false); onClose(); }} onSave={() => { setConfirmOpen(false); }} />
    <SidePanel open={open} onClose={() => editing ? setConfirmOpen(true) : onClose()} title={editing ? "정보시스템 수정" : "정보시스템 상세"} width={500}>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginBottom: 16, marginTop: -6 }}>
        {!editing && <button onClick={() => setEditing(true)} style={{ padding: "5px 14px", fontSize: 12, fontWeight: 600, border: `1px solid ${C.pri}`, borderRadius: 6, background: C.priL, color: C.pri, cursor: "pointer" }}>수정</button>}
      </div>
      <div style={{ marginBottom: 20 }}>
        <SecTitle label="기본 정보" primary />
        <FormRow label="정보시스템 명"><input style={{ ...fInput, ...roS }} value={form.nm} onChange={e => set("nm", e.target.value)} readOnly={ro} /></FormRow>
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="시스템 유형" half>
            <RoSelect readOnly={ro} style={{ ...fSelect, ...roSel }} value={form.type} onChange={e => set("type", e.target.value)}>
              {systemTypeOptions.map(o => <option key={o} value={o}>{o}</option>)}
            </RoSelect>
          </FormRow>
          <FormRow label="사용상태" half>
            <RoSelect readOnly={ro} style={{ ...fSelect, ...roSel }} value={form.useYn} onChange={e => set("useYn", e.target.value)}>
              <option value="Y">사용</option><option value="N">미사용</option>
            </RoSelect>
          </FormRow>
        </div>
        <FormRow label="관리주체">
          <RoSelect readOnly={ro} style={{ ...fSelect, ...roSel }} value={form.org} onChange={e => set("org", e.target.value)}>
            <option value="">선택하세요</option>
            {mgmtOrgOptions.map(o => <option key={o} value={o}>{o}</option>)}
          </RoSelect>
        </FormRow>
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="담당자" half><input style={{ ...fInput, ...roS }} value={form.managerNm} onChange={e => set("managerNm", e.target.value)} readOnly={ro} placeholder="담당자 이름" /></FormRow>
          <FormRow label="연락처" half><input style={{ ...fInput, ...roS }} value={form.managerPhone} onChange={e => set("managerPhone", e.target.value)} readOnly={ro} placeholder="010-0000-0000" /></FormRow>
        </div>
        <FormRow label="비고"><textarea style={{ ...fTextarea, ...(ro ? { ...roS, resize: "none" } : {}) }} value={form.memo} onChange={e => set("memo", e.target.value)} readOnly={ro} placeholder="기타 메모" /></FormRow>
      </div>
      {system && (
        <div style={{ marginBottom: 20 }}>
          <SecTitle label="현황" />
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1, padding: "14px 16px", background: C.priL, borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.pri }}>{system.res}</div>
              <div style={{ fontSize: 11, color: C.txS, marginTop: 2 }}>등록 자원</div>
            </div>
            <div style={{ flex: 1, padding: "14px 16px", background: "#F0FDF4", borderRadius: 8, textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 700, color: "#16A34A" }}>{system.mem}</div>
              <div style={{ fontSize: 11, color: C.txS, marginTop: 2 }}>구성원</div>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 16, borderTop: `1px solid ${C.brd}` }}>
        {editing ? (
          <>
            <Btn onClick={() => setConfirmOpen(true)}>취소</Btn>
            <Btn primary onClick={() => { onUpdate?.(form); setEditing(false); onClose(); }}>저장</Btn>
          </>
        ) : (
          <Btn onClick={onClose}>닫기</Btn>
        )}
      </div>
    </SidePanel>
    </>
  );
};

/* ── 엑셀 일괄등록 모달 ── */
const ExcelUploadModal = ({ open, onClose }) => {
  const [file, setFile] = useState(null);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState({ success: 0, fail: 0 });
  const fileRef = useRef(null);

  const handleFile = (f) => {
    if (!f) return;
    setFile({ name: f.name, size: f.size, type: f.type || "application/octet-stream" });
  };

  const fmtSize = (b) => b < 1024 ? `${b}B` : b < 1048576 ? `${(b/1024).toFixed(1)}KB` : `${(b/1048576).toFixed(1)}MB`;

  const handleDrop = (e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); };

  const handleRegister = () => {
    const total = 5 + Math.floor(Math.random() * 10);
    const fail = Math.floor(Math.random() * 3);
    setResult({ success: total - fail, fail });
    setDone(true);
  };

  const handleClose = () => { setFile(null); setDone(false); setResult({ success: 0, fail: 0 }); onClose(); };

  return (
    <Modal open={open} onClose={handleClose} title="자원 일괄등록 (엑셀)" width={520}>
      {!done ? (
        <>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: C.txt }}>엑셀 파일 업로드</span>
              <a href="#" style={{ fontSize: 12, color: C.pri }}>양식 다운로드</a>
            </div>
            <div onDrop={handleDrop} onDragOver={e => e.preventDefault()}
              onClick={() => fileRef.current?.click()}
              style={{ border: `2px dashed ${C.brd}`, borderRadius: 8, padding: "32px 20px", textAlign: "center", cursor: "pointer", background: "#F9FAFC", transition: "all .3s" }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.pri}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.brd}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📂</div>
              <div style={{ fontSize: 13, color: C.txt, fontWeight: 600 }}>파일을 드래그하거나 클릭하여 업로드</div>
              <div style={{ fontSize: 11, color: C.txL, marginTop: 4 }}>xlsx, xls 파일만 지원 · 최대 10MB</div>
              <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{ display: "none" }} onChange={e => handleFile(e.target.files[0])} />
            </div>
          </div>
          {file && (
            <div style={{ marginBottom: 20, padding: "12px 14px", background: "#F0F9FF", border: `1px solid ${C.pri}30`, borderRadius: 8, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>📄</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.txt }}>{file.name}</div>
                <div style={{ fontSize: 11, color: C.txL, marginTop: 2 }}>{fmtSize(file.size)} · {file.type.includes("sheet") || file.type.includes("excel") ? "엑셀" : file.name.endsWith(".xlsx") ? "XLSX" : "XLS"}</div>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <button onClick={() => fileRef.current?.click()} style={{ padding: "4px 10px", fontSize: 11, border: `1px solid ${C.brd}`, borderRadius: 4, cursor: "pointer", background: "#fff" }}>재업로드</button>
                <button onClick={() => setFile(null)} style={{ padding: "4px 10px", fontSize: 11, border: "1px solid #fca5a5", borderRadius: 4, cursor: "pointer", background: "#fef2f2", color: "#ef4444" }}>삭제</button>
              </div>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingTop: 16, borderTop: `1px solid ${C.brd}` }}>
            <Btn onClick={handleClose}>취소</Btn>
            <Btn primary onClick={handleRegister} disabled={!file} style={!file ? { opacity: 0.4, cursor: "not-allowed" } : {}}>등록</Btn>
          </div>
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: C.txt, marginBottom: 8 }}>등록 완료</div>
          <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 20, marginBottom: 28 }}>
            <div style={{ padding: "16px 28px", background: "#F0FDF4", borderRadius: 10, border: "1px solid #bbf7d0" }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#16A34A" }}>{result.success}</div>
              <div style={{ fontSize: 12, color: "#16A34A", marginTop: 2 }}>성공</div>
            </div>
            {result.fail > 0 && (
              <div style={{ padding: "16px 28px", background: "#FEF2F2", borderRadius: 10, border: "1px solid #fecaca" }}>
                <div style={{ fontSize: 28, fontWeight: 700, color: "#EF4444" }}>{result.fail}</div>
                <div style={{ fontSize: 12, color: "#EF4444", marginTop: 2 }}>실패</div>
              </div>
            )}
          </div>
          {result.fail > 0 && <div style={{ fontSize: 12, color: C.txL, marginBottom: 20 }}>실패한 자원의 오류 내용을 확인하고 재업로드 해주세요.</div>}
          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            {result.fail > 0 && <Btn>오류 파일 다운로드</Btn>}
            <Btn primary onClick={handleClose}>닫기</Btn>
          </div>
        </div>
      )}
    </Modal>
  );
};

/* ──── PAGES: MANAGER ──── */
const MgrRes = ({ toast }) => {
  const [sel, setSel] = useState(null);
  const [showAddSystem, setShowAddSystem] = useState(false);
  const [systems, setSystems] = useState(SYS);
  const [resources, setResources] = useState(RES);
  const [panelRes, setPanelRes] = useState(null);
  const [showAddRes, setShowAddRes] = useState(false);
  const [showSysDetail, setShowSysDetail] = useState(false);
  const [detailSys, setDetailSys] = useState(null);
  const [showExcelUpload, setShowExcelUpload] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const filtered = sel ? resources.filter(r => r.sysId === sel) : resources;

  const handleAddSystem = (form) => { if(toast) toast("정보시스템이 등록되었습니다.");
    const newSys = { id: form.systemId, nm: form.systemNm, type: form.systemType, org: form.mgmtOrg || "—", useYn: form.useYn, mem: form.members.length, res: 0 };
    setSystems(prev => [...prev, newSys]);
  };

  const handleUpdateSystem = (form) => {
    setSystems(prev => prev.map(s => s.id === detailSys?.id ? { ...s, ...form } : s));
  };

  const handleResourceSubmit = (form, editId) => {
    if (editId) {
      setResources(prev => prev.map(r => r.id === editId ? { ...r, ...form, sysNm: (systems.find(s => s.id === form.sysId) || {}).nm || "" } : r));
    } else {
      const prefix = (systems.find(s => s.id === form.sysId)?.id || "RES").slice(0,3).toUpperCase();
      const autoId = `${prefix}-${String(Date.now()).slice(-6)}`;
      const newRes = { id: Date.now(), ...form, resourceId: autoId, sysNm: (systems.find(s => s.id === form.sysId) || {}).nm || "" };
      setResources(prev => [...prev, newRes]);
    }
  };

  // 드래그 핸들러
  const handleDragStart = (e, idx) => { setDragIdx(idx); e.dataTransfer.effectAllowed = "move"; };
  const handleDragOver = (e, idx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    setSystems(prev => {
      const arr = [...prev];
      const [moved] = arr.splice(dragIdx, 1);
      arr.splice(idx, 0, moved);
      setDragIdx(idx);
      return arr;
    });
  };
  const handleDragEnd = () => setDragIdx(null);

  const PAGE_SZ = 10;
  const [resPage, setResPage] = useState(1);
  const [resKw,   setResKw]   = useState("");

  const filteredRes = filtered.filter(r => {
    const kw = resKw.trim().toLowerCase();
    return !kw || r.nm.toLowerCase().includes(kw) || (r.ip || "").includes(kw);
  });
  const totalResPages = Math.max(1, Math.ceil(filteredRes.length / PAGE_SZ));
  const pagedRes = filteredRes.slice((resPage - 1) * PAGE_SZ, resPage * PAGE_SZ);
  const selSysNm = sel ? (systems.find(s => s.id === sel)?.nm || "") : "";

  return (
    <div>
      <PH title="자원관리" bc="홈 > 자원관리" />

      <div style={{ display: "flex", gap: 14, alignItems: "start" }}>

        {/* ── 왼쪽: 정보시스템 패널 ── */}
        <div style={{ width: 240, flexShrink: 0, background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 6, overflow: "hidden", position: "sticky", top: 20, maxHeight: "calc(100vh - 170px)", display: "flex", flexDirection: "column" }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.brd}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: C.txH }}>정보시스템</span>
            <button onClick={() => setShowAddSystem(true)}
              style={{ height: 36, padding: "4px 12px", fontSize: 14, fontWeight: 500, border: `1px solid ${C.sec}`, borderRadius: 4, color: C.sec, background: "#fff", cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", transition: "all .3s" }}
              onMouseEnter={e => { e.currentTarget.style.background = C.sec; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = C.sec; }}>+ 추가</button>
          </div>
          <div style={{ padding: "6px 0", flex: 1, overflowY: "auto" }}>
            {/* 전체 */}
            {(() => {
              const active = sel === null;
              return (
                <div onClick={() => { setSel(null); setResPage(1); }}
                  style={{ display: "flex", alignItems: "center",
                    padding: "9px 14px", cursor: "pointer", borderRadius: 6, margin: "0 6px",
                    background: active ? C.priL : "transparent",
                    transition: "all .3s" }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.secL; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? C.priL : "transparent"; }}>
                  <span style={{ fontSize: 14, fontWeight: active ? 600 : 500, color: active ? C.sec : C.txt, flex: 1 }}>전체</span>
                  <span style={{ fontSize: 11, fontWeight: 500,
                    background: "#EEEEEE", color: "#929292",
                    borderRadius: 10, padding: "1px 7px", minWidth: 20, textAlign: "center" }}>{resources.length}</span>
                </div>
              );
            })()}
            {/* 시스템 목록 */}
            {systems.map((s, idx) => {
              const active = sel === s.id;
              return (
                <div key={s.id}
                  draggable
                  onDragStart={e => handleDragStart(e, idx)}
                  onDragOver={e => handleDragOver(e, idx)}
                  onDragEnd={handleDragEnd}
                  style={{ display: "flex", alignItems: "center",
                    padding: "8px 14px 8px 10px", cursor: "pointer", borderRadius: 6, margin: "0 6px",
                    background: active ? C.priL : dragIdx === idx ? "#F0F9FF" : "transparent",
                    transition: "all .3s" }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.secL; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? C.priL : "transparent"; }}>
                  <div style={{ flex: 1, overflow: "hidden", minWidth: 0 }} onClick={() => { setSel(active ? null : s.id); setResPage(1); }}>
                    <div style={{ fontSize: 14, fontWeight: active ? 600 : 500, color: active ? C.sec : C.txt,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: "20px" }}>{s.nm}</div>
                    <div style={{ fontSize: 11, color: C.txL, marginTop: 1 }}>자원 {s.res}개 · 구성원 {s.mem}명</div>
                  </div>
                  {/* 상세 아이콘 버튼 (세로 점 3개) */}
                  <button
                    onClick={e => { e.stopPropagation(); setDetailSys(s); setShowSysDetail(true); }}
                    style={{ flexShrink: 0, marginLeft: 4, width: 24, height: 24, border: `1px solid ${C.brd}`, borderRadius: 4, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.txL }}
                    onMouseEnter={e => { e.currentTarget.style.background = C.secL; e.currentTarget.style.color = C.pri; e.currentTarget.style.borderColor = C.pri; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = C.txL; e.currentTarget.style.borderColor = C.brd; }}
                    title="상세 보기">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                      <circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/>
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 오른쪽: 자원 목록 ── */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* 검색폼 (searchform) */}
          <div style={{ width: "100%", border: `1px solid ${C.brd}`, background: C.bg, borderRadius: 6, padding: "16px 12px", display: "flex", gap: 8, marginBottom: 16, alignItems: "stretch" }}>
            <div style={{ display: "flex", flex: 1, gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.txS }}>자원명/IP</span>
                <input value={resKw} onChange={e => { setResKw(e.target.value); setResPage(1); }} placeholder="자원명 또는 IP로 검색" style={{ padding: "6px 12px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 15, outline: "none", color: C.txt, background: "#fff", minHeight: 36, width: 240, fontFamily: "inherit" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.txS }}>상태</span>
                <select style={{ padding: "6px 12px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 15, background: "#fff", color: C.txt, minHeight: 36, fontFamily: "inherit" }}>
                  <option>전체</option><option>사용</option><option>미사용</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "stretch" }}>
              <button style={{ background: "#fff", border: `1px solid ${C.sec}`, color: C.sec, borderRadius: 4, padding: "0 24px", fontSize: 15, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", minWidth: 60, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s" }}
              onMouseEnter={e => { e.currentTarget.style.background = C.sec; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = C.sec; }}>검색</button>
              <button onClick={() => { setResQ(""); setResSt("전체"); }} title="검색 초기화" style={{ background: C.priL, border: `1px solid ${C.pri}40`, borderRadius: 4, padding: "0 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", minWidth: 40 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 2v4h-4" stroke={C.pri} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.5 10a6 6 0 11-1.3-6.3L14 6" stroke={C.pri} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>

          {/* 섹션 제목 (sec-title) */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingTop: 38, paddingBottom: 8, borderBottom: `1px solid ${C.brdD}`, marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: C.txH }}>{sel ? selSysNm : "전체"} 자원 목록</span>
              <span style={{ fontSize: 12, color: C.txL }}>{filteredRes.length}건</span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <button onClick={() => setShowExcelUpload(true)} style={{ height: 36, padding: "4px 12px", borderRadius: 4, fontSize: 14, fontWeight: 500, background: "#fff", color: C.txt, border: `1px solid ${C.brd}`, cursor: "pointer", fontFamily: "inherit", transition: "all .3s" }}
                onMouseEnter={e => e.currentTarget.style.background = C.bg} onMouseLeave={e => e.currentTarget.style.background = "#fff"}>엑셀 일괄등록</button>
              <button onClick={() => setShowAddRes(true)} style={{ height: 36, padding: "4px 12px", borderRadius: 4, fontSize: 14, fontWeight: 500, background: C.sec, color: "#fff", border: "none", cursor: "pointer", fontFamily: "inherit", transition: "all .3s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#3a6cc8"} onMouseLeave={e => e.currentTarget.style.background = C.sec}>+ 자원추가</button>
            </div>
          </div>

          {/* 자원 테이블 (data-table) */}
          <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: "100%", width: "max-content", borderCollapse: "collapse", fontSize: 15, borderBottom: `1px solid ${C.brd}` }}>
            <thead>
              <tr style={{ borderTop: `1px solid ${C.txH}` }}>
                {[{t:"상태",w:100},{t:"자원명",a:"left",w:200},{t:"정보시스템"},{t:"중분류"},{t:"소분류"},{t:"IP"},{t:"OS"},{t:"점검자"}].map((h, i) => (
                  <th key={i} style={{ padding: "9px 12px", borderBottom: `1px solid ${C.brdD}`, textAlign: h.a || "center", fontSize: 14, fontWeight: 400, color: C.txL, verticalAlign: "middle", ...(h.w ? {width: h.w} : {}) }}>{h.t}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedRes.map((r, i) => {
                const inspNames = (r.inspectors && r.inspectors.length > 0)
                  ? r.inspectors.map(uid => { const u = USERS.find(x => x.userId === uid); return u ? u.userNm : uid; }).join(", ")
                  : "—";
                return (
                  <tr key={r.id || i} style={{ cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = C.secL}
                    onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle", width: 100 }}><YnBadge v={r.st} /></td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "left", verticalAlign: "middle", width: 200 }}>
                      <span onClick={e => { e.stopPropagation(); setPanelRes(r); }}
                        style={{ fontWeight: 600, color: C.pri, cursor: "pointer" }}>{r.nm}</span>
                    </td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", color: C.txt, verticalAlign: "middle" }}>{r.sysNm}</td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", color: C.txt, verticalAlign: "middle" }}>{r.mid}</td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", color: C.txt, verticalAlign: "middle" }}>{r.small}</td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", color: C.txt, fontFamily: "monospace", fontSize: 13, verticalAlign: "middle" }}>{r.ip}</td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", color: C.txt, verticalAlign: "middle" }}>{r.os || "—"}</td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", color: C.txt, verticalAlign: "middle" }}>{inspNames}</td>
                  </tr>
                );
              })}
              {!pagedRes.length && (
                <tr><td colSpan={8} style={{ padding: 48, textAlign: "center", color: C.txL, fontSize: 14 }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 48, height: 48, borderRadius: 24, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Ic n="db" s={24} c={C.txX} />
                    </div>
                    <span>데이터가 없습니다.</span>
                  </div>
                </td></tr>
              )}
            </tbody>
          </table>
          </div>

          {/* 페이지네이션 (pagination-area) */}
          {totalResPages > 1 && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "16px 0", position: "relative" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ display: "flex", gap: 2 }}>
                  <button onClick={() => setResPage(1)} disabled={resPage === 1} style={{ width: 28, height: 28, background: "none", border: "none", cursor: resPage === 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, color: resPage === 1 ? C.txX : C.txS }}>
                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none"><path d="M6.5 1L1.5 6L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button onClick={() => setResPage(Math.max(1, resPage - 1))} disabled={resPage === 1} style={{ width: 28, height: 28, background: "none", border: "none", cursor: resPage === 1 ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, color: resPage === 1 ? C.txX : C.txS }}>
                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none"><path d="M6.5 1L1.5 6L6.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
                <div style={{ display: "flex", gap: 2 }}>
                  {Array.from({length: Math.min(5, totalResPages)}, (_, i) => {
                    const start = Math.max(1, Math.min(resPage - 2, totalResPages - 4));
                    const n = start + i;
                    return n <= totalResPages ? (
                      <button key={n} onClick={() => setResPage(n)}
                        style={{ minWidth: 28, height: 28, padding: "0 6px", background: resPage === n ? C.sec : "none", border: "none", cursor: "pointer", borderRadius: 4, fontSize: 14, fontWeight: resPage === n ? 600 : 400, color: resPage === n ? "#fff" : C.txS, fontFamily: "inherit" }}>{n}</button>
                    ) : null;
                  })}
                </div>
                <div style={{ display: "flex", gap: 2 }}>
                  <button onClick={() => setResPage(Math.min(totalResPages, resPage + 1))} disabled={resPage === totalResPages} style={{ width: 28, height: 28, background: "none", border: "none", cursor: resPage === totalResPages ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, color: resPage === totalResPages ? C.txX : C.txS }}>
                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none"><path d="M1.5 1L6.5 6L1.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button onClick={() => setResPage(totalResPages)} disabled={resPage === totalResPages} style={{ width: 28, height: 28, background: "none", border: "none", cursor: resPage === totalResPages ? "default" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, color: resPage === totalResPages ? C.txX : C.txS }}>
                    <svg width="8" height="12" viewBox="0 0 8 12" fill="none"><path d="M1.5 1L6.5 6L1.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <AddSystemModal open={showAddSystem} onClose={() => setShowAddSystem(false)} onSubmit={handleAddSystem} />
      <ResourcePanel open={!!panelRes}  onClose={() => setPanelRes(null)}    resource={panelRes} onSubmit={handleResourceSubmit} systems={systems} />
      <ResourcePanel open={showAddRes}  onClose={() => setShowAddRes(false)} resource={null}     onSubmit={handleResourceSubmit} systems={systems} />
      <SystemDetailPanel open={showSysDetail} onClose={() => setShowSysDetail(false)} system={detailSys} onUpdate={handleUpdateSystem} />
      <ExcelUploadModal open={showExcelUpload} onClose={() => { setShowExcelUpload(false); if(toast) toast("엑셀 업로드가 완료되었습니다."); }} />
    </div>
  );
};

const MgrDash = ({ nav }) => {
  const cnt = { s: DI.filter(x => x.st === "예정").length, p: DI.filter(x => x.st === "진행").length, d: DI.filter(x => x.st === "지연").length, c: DI.filter(x => x.st === "완료").length };
  return <div>
    <PH title="대시보드" bc="홈 > 대시보드" />
    <div style={{ display: "flex", gap: 16, marginBottom: 20, flexWrap: "wrap" }}>
      <Stat label="전체 정보시스템" value={SYS.length} color={C.pri} icon="server" onClick={()=>nav&&nav("mr")} />
      <Stat label="전체 자원" value={RES.length} color={C.sec} icon="db" onClick={()=>nav&&nav("mr")} />
      <Stat label="오늘 점검 예정" value={cnt.s + cnt.p} color="#F36D00" icon="cal" onClick={()=>nav&&nav("mis")} />
      <Stat label="점검 지연" value={cnt.d} color={C.red} icon="alert" onClick={()=>nav&&nav("mis")} />
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <Card title="오늘의 점검 현황">
        <div style={{ display: "flex", gap: 14 }}>
          {[["예정", cnt.s], ["진행", cnt.p], ["지연", cnt.d], ["완료", cnt.c]].map(([s, v]) => <div key={s} style={{ textAlign: "center", flex: 1 }}><div style={{ fontSize: 44, fontWeight: 700, color: SC[s].t }}>{v}</div><Badge status={s} /></div>)}
        </div>
      </Card>
      <Card title="최근 공지사항" onClick={()=>nav&&nav("mbn")}>
        {NT.slice(0, 3).map(n => <div key={n.id} style={{ padding: "7px 0", borderBottom: `1px solid ${C.brd}`, display: "flex", justifyContent: "space-between" }}><span style={{ fontSize: 13 }}>{n.title}</span><span style={{ fontSize: 11, color: C.txL }}>{n.dt}</span></div>)}
      </Card>
      <Card title="점검 상태 보고" style={{ gridColumn: "span 2" }}>
        {(() => {
          const days = 90, today = new Date("2026-02-11");
          const bars = Array.from({ length: days }, (_, i) => {
            const d = new Date(today); d.setDate(d.getDate() - (days - 1 - i));
            const ds = d.toISOString().slice(0, 10);
            const hash = (ds.charCodeAt(5) * 7 + ds.charCodeAt(8) * 13 + ds.charCodeAt(9) * 23) % 100;
            const st = hash < 55 ? "good" : hash < 72 ? "warn" : hash < 85 ? "minor" : hash < 93 ? "bad" : "down";
            return { ds, st };
          });
          const colors = { good: "#89c36f", warn: "#c1de82", minor: "#fbf0ae", bad: "#e8915b", down: "#9b212c" };
          const goodDays = bars.filter(b => b.st === "good" || b.st === "warn").length;
          const rate = ((goodDays / days) * 100).toFixed(2);
          return <>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>일상점검 완료율</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: parseFloat(rate) >= 98 ? "#16a34a" : parseFloat(rate) >= 95 ? "#ca8a04" : C.red }}>{rate}%</span>
            </div>
            <div style={{ display: "flex", gap: 1.5, height: 28, borderRadius: 4, overflow: "hidden", marginBottom: 6 }}>
              {bars.map((b, i) => <div key={i} title={`${b.ds} — ${b.st === "good" ? "정상" : b.st === "warn" ? "경미" : b.st === "minor" ? "경고" : b.st === "bad" ? "지연" : "장애"}`} style={{ flex: 1, background: colors[b.st], borderRadius: 2, cursor: "pointer", transition: "all .3s" }} onMouseEnter={e => e.currentTarget.style.opacity = "0.7"} onMouseLeave={e => e.currentTarget.style.opacity = "1"} />)}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: C.txL, marginBottom: 10 }}>
              <span>{days}일 전</span>
              <span>오늘</span>
            </div>
            <div style={{ display: "flex", gap: 14, fontSize: 11, color: C.txS }}>
              {[["정상","good"],["경미","warn"],["경고","minor"],["지연","bad"],["장애","down"]].map(([l, k]) => <span key={k} style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: colors[k] }} />{l}</span>)}
            </div>
          </>;
        })()}
      </Card>

      {/* ── 자원유형별 / 자동vs육안 / 이상이력 — 3칼럼 ── */}
      <div style={{ gridColumn: "span 2", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>

      {/* ── 자원 유형별 점검 현황 (가로 막대) ── */}
      <Card title="자원 유형별 점검 현황">
        {(() => {
          const types = ["서버","WEB","WAS","DBMS","네트워크","보안","스토리지","백업"];
          const data = types.map(t => {
            const total = RES.filter(r => r.mid === t).length;
            const h = (t.charCodeAt(0) * 7 + t.length * 13) % 100;
            const ok = Math.round(total * (0.5 + (h % 40) / 100));
            const ng = Math.round(total * ((h % 15) / 100));
            const none = Math.max(0, total - ok - ng);
            return { t, ok, ng, none, total };
          }).filter(d => d.total > 0);
          const max = Math.max(...data.map(d => d.total), 1);
          return <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {data.map(d => <div key={d.t} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 52, fontSize: 11, fontWeight: 500, textAlign: "right", flexShrink: 0, color: C.txS }}>{d.t}</span>
              <div style={{ flex: 1, display: "flex", height: 18, borderRadius: 3, overflow: "hidden", background: "#F9FAFC" }}>
                {d.ok > 0 && <div title={`정상 ${d.ok}`} style={{ width: `${(d.ok / max) * 100}%`, background: "#479559" }} />}
                {d.ng > 0 && <div title={`비정상 ${d.ng}`} style={{ width: `${(d.ng / max) * 100}%`, background: "#f2c67d" }} />}
                {d.none > 0 && <div title={`미점검 ${d.none}`} style={{ width: `${(d.none / max) * 100}%`, background: "#BDC3C7" }} />}
              </div>
              <span style={{ fontSize: 10, color: C.txL, width: 22, flexShrink: 0 }}>{d.total}</span>
            </div>)}
            <div style={{ display: "flex", gap: 12, fontSize: 10, color: C.txS, marginTop: 4, paddingLeft: 60 }}>
              {[["정상","#479559"],["비정상","#f2c67d"],["미점검","#BDC3C7"]].map(([l, c]) => <span key={l} style={{ display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 8, height: 8, borderRadius: 2, background: c }} />{l}</span>)}
            </div>
          </div>;
        })()}
      </Card>

      {/* ── 자동점검 vs 육안점검 비율 ── */}
      <Card title="자동점검 vs 육안점검 비율">
        {(() => {
          const auto = 68, manual = 32;
          const total = auto + manual;
          const r = 56, cx = 70, cy = 70;
          const autoAngle = (auto / total) * 360;
          const toRad = a => (a - 90) * Math.PI / 180;
          const x1 = cx + r * Math.cos(toRad(0)), y1 = cy + r * Math.sin(toRad(0));
          const x2 = cx + r * Math.cos(toRad(autoAngle)), y2 = cy + r * Math.sin(toRad(autoAngle));
          const lg = autoAngle > 180 ? 1 : 0;
          return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx={cx} cy={cy} r={r} fill="#EEEEEE" />
              <path d={`M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${lg},1 ${x2},${y2} Z`} fill={C.pri} />
              <circle cx={cx} cy={cy} r={32} fill="#fff" />
              <text x={cx} y={cy - 3} textAnchor="middle" style={{ fontSize: 16, fontWeight: 700, fill: C.txt }}>{total}</text>
              <text x={cx} y={cy + 11} textAnchor="middle" style={{ fontSize: 9, fill: C.txL }}>전체 점검</text>
            </svg>
            <div style={{ display: "flex", gap: 24, justifyContent: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3, justifyContent: "center" }}><span style={{ width: 10, height: 10, borderRadius: 2, background: C.pri }} /><span style={{ fontSize: 12, fontWeight: 600 }}>자동점검</span></div>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.pri }}>{auto}%</div>
                <div style={{ fontSize: 11, color: C.txL }}>{Math.round(DI.length * auto / 100)}건</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3, justifyContent: "center" }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "#EEEEEE" }} /><span style={{ fontSize: 12, fontWeight: 600 }}>육안점검</span></div>
                <div style={{ fontSize: 20, fontWeight: 700, color: C.txS }}>{manual}%</div>
                <div style={{ fontSize: 11, color: C.txL }}>{Math.round(DI.length * manual / 100)}건</div>
              </div>
            </div>
          </div>;
        })()}
      </Card>

      {/* ── 최근 이상 이력 타임라인 ── */}
      <Card title="최근 이상 이력" extra={<span style={{ fontSize: 10, color: C.txL }}>최근 24시간</span>}>
        {(() => {
          const logs = [
            { id: 1, t: "09:15", lv: "critical", res: "CRM-DB-01", msg: "디스크 사용률 92% 초과" },
            { id: 2, t: "08:42", lv: "warning", res: "SEC-NET-03", msg: "IPS 정책 업데이트 실패" },
            { id: 3, t: "07:30", lv: "critical", res: "MAIL-WAS-02", msg: "서비스 포트 응답 없음" },
            { id: 4, t: "어제 22:10", lv: "warning", res: "FIN-SVR-04", msg: "CPU 사용률 83% 경고" },
            { id: 5, t: "어제 18:35", lv: "info", res: "GW-WEB-01", msg: "SSL 인증서 만료 30일 전" },
            { id: 6, t: "어제 15:20", lv: "critical", res: "LOG-DB-02", msg: "커넥션 풀 고갈" },
            { id: 7, t: "어제 12:05", lv: "warning", res: "HR-SVR-01", msg: "메모리 사용률 87%" },
            { id: 8, t: "어제 09:40", lv: "info", res: "SHR-NET-05", msg: "펌웨어 업데이트 권고" },
          ];
          const lvC = { critical: { bd: "#ef4444", lb: "장애" }, warning: { bd: "#f59e0b", lb: "경고" }, info: { bd: "#3b82f6", lb: "알림" } };
          return <div style={{ position: "relative", paddingLeft: 16 }}>
            <div style={{ position: "absolute", left: 5, top: 4, bottom: 4, width: 2, background: C.brd }} />
            {logs.slice(0, 5).map((l, i) => { const lv = lvC[l.lv]; return <div key={l.id} style={{ position: "relative", paddingLeft: 14, paddingBottom: i < Math.min(logs.length, 5) - 1 ? 10 : 0 }}>
              <div style={{ position: "absolute", left: -13, top: 3, width: 8, height: 8, borderRadius: 4, background: lv.bd, border: "2px solid #fff" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 10, color: C.txL, minWidth: 50 }}>{l.t}</span>
                <span style={{ fontSize: 10, fontWeight: 600, color: lv.bd }}>{lv.lb}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.txt }}>{l.res}</span>
              </div>
              <div style={{ fontSize: 11, color: C.txS, marginTop: 1 }}>{l.msg}</div>
            </div>; })}
          </div>;
        })()}
      </Card>

      </div>

      {/* ── 관리자 전용: 시스템 운영 현황 ── */}
      <Card title="시스템 운영 현황" style={{ gridColumn: "span 2" }} extra={<span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "#dbeafe", color: "#1d4ed8", fontWeight: 600 }}>관리자 전용</span>}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {/* 라이선스 현황 */}
          <div style={{ padding: 16, borderRadius: 8, background: "#fefce8", border: "1px solid #fef08a" }}>
            <div style={{ fontSize: 12, color: "#854d0e", fontWeight: 600, marginBottom: 8 }}>라이선스 현황</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: C.txS }}>정보시스템</span><span style={{ fontSize: 12, fontWeight: 600 }}>{SYS.filter(s => s.id !== "SHARED").length} / 15</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: C.txS }}>자원</span><span style={{ fontSize: 12, fontWeight: 600 }}>{RES.length} / 500</span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: "#EEEEEE", overflow: "hidden" }}>
              <div style={{ width: `${(RES.length / 500) * 100}%`, height: "100%", borderRadius: 3, background: RES.length > 450 ? C.red : RES.length > 350 ? "#f59e0b" : "#22c55e" }} />
            </div>
            <div style={{ fontSize: 10, color: C.txL, marginTop: 4 }}>만료일: 2026-12-31</div>
          </div>
          {/* 코어 연동 상태 */}
          <div style={{ padding: 16, borderRadius: 8, background: C.priL, border: `1px solid ${C.pri}30` }}>
            <div style={{ fontSize: 12, color: "#1e40af", fontWeight: 600, marginBottom: 8 }}>코어 연동 상태</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 5, background: "#22c55e", animation: "pulse 2s infinite" }} />
              <span style={{ fontSize: 13, fontWeight: 600, color: "#16a34a" }}>정상 운영 중</span>
            </div>
            <div style={{ fontSize: 11, color: C.txL }}>마지막 통신: 09:15:32</div>
            <div style={{ fontSize: 11, color: C.txL }}>평균 응답: 124ms</div>
          </div>
          {/* 배치 실행 현황 */}
          <div style={{ padding: 16, borderRadius: 8, background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
            <div style={{ fontSize: 12, color: "#166534", fontWeight: 600, marginBottom: 8 }}>배치 실행 현황</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: C.txS }}>오늘 실행</span><span style={{ fontSize: 13, fontWeight: 700 }}>24회</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: C.txS }}>성공</span><span style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>23회</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11, color: C.txS }}>실패</span><span style={{ fontSize: 13, fontWeight: 700, color: C.red }}>1회</span>
            </div>
          </div>
          {/* 최근 배치 결과 */}
          <div style={{ padding: 16, borderRadius: 8, background: "#faf5ff", border: "1px solid #e9d5ff" }}>
            <div style={{ fontSize: 12, color: "#6b21a8", fontWeight: 600, marginBottom: 8 }}>최근 배치 결과</div>
            {[{ t: "09:00", s: true, n: "CRM 서버 일간점검" }, { t: "08:00", s: true, n: "WEB 서비스 일간점검" }, { t: "07:00", s: false, n: "SEC 보안 점검" }, { t: "06:00", s: true, n: "HR 서버 일간점검" }].map((b, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: 11 }}>
                <span style={{ width: 6, height: 6, borderRadius: 3, background: b.s ? "#22c55e" : "#ef4444" }} />
                <span style={{ color: C.txL, minWidth: 36 }}>{b.t}</span>
                <span style={{ color: C.txS }}>{b.n}</span>
              </div>
            ))}
          </div>
        </div>
        <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
      </Card>

      {/* ── 정보시스템별 자원 현황 ── */}
      <Card title="정보시스템별 자원 현황" style={{ gridColumn: "span 2" }}>
        <Tbl cols={[{ t: "시스템명", k: "nm" }, { t: "유형", k: "type" }, { t: "관리주체", k: "org" }, { t: "자원수", k: "res" }, { t: "구성원수", k: "mem" }, { t: "상태", k: "useYn", r: v => <YnBadge v={v} /> }]} data={SYS} noPaging />
      </Card>
    </div>
  </div>;
};

const MgrInspSt = () => {
  const [selDay, setSelDay] = useState(null);
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(1); // 0-indexed, 1=Feb
  const [showYMPicker, setShowYMPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(2026);

  const pad = n => String(n).padStart(2, "0");
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const goMonthPrev = () => { let m = viewMonth - 1, y = viewYear; if (m < 0) { m = 11; y--; } setViewMonth(m); setViewYear(y); setSelDay(null); };
  const goMonthNext = () => { let m = viewMonth + 1, y = viewYear; if (m > 11) { m = 0; y++; } setViewMonth(m); setViewYear(y); setSelDay(null); };

  const allInsp = [...DI.map(x => ({...x, _type: "일상"})), ...SI.map(x => ({...x, _type: "특별", resNm: x.title}))];
  const dayItems = selDay
    ? allInsp.filter(x => x.due === `${viewYear}-${pad(viewMonth + 1)}-${pad(selDay)}`)
    : [];

  return <div>
    <PH title="점검현황" bc="홈 > 점검현황" />
    <div style={{ background: C.white, borderRadius: 8, border: `1px solid ${C.brd}`, overflow: "hidden", display: "flex", flexDirection: "column", height: "calc(98vh - 170px)", maxHeight: 1500 }}>
      {/* 캘린더 네비게이션 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 12px", borderBottom: `1px solid ${C.brd}`, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, position: "relative" }}>
          <span onClick={() => { setPickerYear(viewYear); setShowYMPicker(!showYMPicker); }}
            style={{ fontSize: 28, fontWeight: 700, color: C.txH, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, userSelect: "none", padding: "2px 0", transition: "opacity .2s" }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
            {viewYear}.{viewMonth + 1}
            <svg width="14" height="14" viewBox="0 0 12 12" fill="none" style={{ marginTop: 2 }}><path d="M3 4.5L6 7.5L9 4.5" stroke={C.txL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          {showYMPicker && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 98 }} onClick={() => setShowYMPicker(false)} />
              <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 99,
                background: "#fff", borderRadius: 10, boxShadow: "0 4px 24px rgba(0,0,0,.14)",
                border: `1px solid ${C.brd}`, padding: "14px 16px", minWidth: 260 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                  <span onClick={() => setPickerYear(pickerYear - 1)} style={{ cursor: "pointer", padding: "2px 10px", fontWeight: 700, fontSize: 14, color: C.txS, userSelect: "none" }}>‹</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: C.txt }}>{pickerYear}년</span>
                  <span onClick={() => setPickerYear(pickerYear + 1)} style={{ cursor: "pointer", padding: "2px 10px", fontWeight: 700, fontSize: 14, color: C.txS, userSelect: "none" }}>›</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                  {Array.from({ length: 12 }, (_, i) => {
                    const isSel = pickerYear === viewYear && i === viewMonth;
                    return (
                      <div key={i} onClick={() => { setViewYear(pickerYear); setViewMonth(i); setShowYMPicker(false); setSelDay(null); }}
                        style={{ textAlign: "center", padding: "7px 0", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer",
                          background: isSel ? C.pri : "transparent", color: isSel ? "#fff" : C.txt,
                          border: isSel ? `1px solid ${C.pri}` : `1px solid ${C.brd}` }}
                        onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = C.priL; }}
                        onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = "transparent"; }}>
                        {pad(i + 1)}월
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
        {/* 범례 */}
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {[{ bg: "#dcfce7", bd: "#16653433", l: "일상점검" }, { bg: "#fff7ed", bd: "#c2410c33", l: "특별점검" }].map(lg =>
            <span key={lg.l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.txS }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: lg.bg, border: `1px solid ${lg.bd}` }} />{lg.l}
            </span>
          )}
        </div>
      </div>

      {/* 요일 헤더 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", flexShrink: 0 }}>
        {["일","월","화","수","목","금","토"].map((d, i) => (
          <div key={d} style={{ padding: "10px 12px", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase",
            color: i === 0 ? "#ef4444" : i === 6 ? C.pri : C.txL, borderBottom: `1px solid ${C.brd}` }}>{d}</div>
        ))}
      </div>

      {/* 날짜 그리드 - 일요일 시작 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gridTemplateRows: `repeat(${Math.ceil((firstDay + daysInMonth) / 7)}, 1fr)`, flex: 1, minHeight: 0 }}>
        {(() => {
          const sunFirst = firstDay;
          const rows = Math.ceil((sunFirst + daysInMonth) / 7) * 7;
          const rowCount = rows / 7;
          const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();
          return Array.from({ length: rows }, (_, idx) => {
            const dayNum = idx - sunFirst + 1;
            const isValid = dayNum >= 1 && dayNum <= daysInMonth;
            let displayDay = dayNum;
            if (dayNum < 1) displayDay = prevMonthDays + dayNum;
            else if (dayNum > daysInMonth) displayDay = dayNum - daysInMonth;
            const ds = isValid ? `${viewYear}-${pad(viewMonth + 1)}-${pad(dayNum)}` : "";
            const dailyCnt = isValid ? DI.filter(x => x.due === ds).length : 0;
            const specCnt = isValid ? SI.filter(x => x.due === ds).length : 0;
            const today = isValid && viewYear === 2026 && viewMonth === 1 && dayNum === 11;
            const isSel = selDay === dayNum && isValid;
            const dow = idx % 7; // 0=일 1=월 ... 6=토
            const isWeekRow = Math.floor(idx / 7);
            const isLastRow = isWeekRow === Math.ceil(rows / 7) - 1;

            return (
              <div key={idx}
                onClick={() => isValid && setSelDay(dayNum === selDay ? null : dayNum)}
                style={{
                  position: "relative", padding: "8px 12px",
                  borderBottom: isLastRow ? "none" : `1px solid ${C.brd}`,
                  borderRight: dow < 6 ? `1px solid ${C.brd}` : "none",
                  cursor: isValid ? "pointer" : "default",
                  transition: "background .15s",
                  background: isSel ? C.priL : "transparent",
                }}
                onMouseEnter={e => { if (isValid && !isSel) e.currentTarget.style.background = "#FAFAFA"; }}
                onMouseLeave={e => { if (isValid && !isSel) e.currentTarget.style.background = isSel ? C.priL : "transparent"; }}
              >
                {/* 지연 건이 있으면 오른쪽 상단 빨간 동그라미 */}
                {isValid && (DI.some(x => x.due === ds && x.st === "지연") || SI.some(x => x.due === ds && x.st === "지연")) && (
                  <div style={{ position: "absolute", top: 16, right: 10, width: 8, height: 8, borderRadius: "50%", background: C.red }} />
                )}
                {isSel && (
                  <div style={{ position: "absolute", top: 0, right: 0, width: 3, height: "100%", background: C.pri }} />
                )}
                <div style={{
                  fontSize: 22, fontWeight: 700, lineHeight: 1, marginBottom: 6,
                  color: !isValid ? C.txX : today ? C.red : dow === 0 ? "#ef4444" : dow === 6 ? C.pri : C.txH,
                }}>{pad(displayDay)}</div>
                {isValid && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {dailyCnt > 0 && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#166534", lineHeight: 1.4, fontWeight: 500 }}>일상점검 <span style={{ minWidth: 16, height: 16, borderRadius: 8, background: "#dcfce7", fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{dailyCnt}</span></div>}
                    {specCnt > 0 && <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#c2410c", lineHeight: 1.4, fontWeight: 500 }}>특별점검 <span style={{ minWidth: 16, height: 16, borderRadius: 8, background: "#fff7ed", fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{specCnt}</span></div>}
                  </div>
                )}
              </div>
            );
          });
        })()}
      </div>
    </div>

    <SidePanel open={selDay !== null && dayItems.length > 0} onClose={() => setSelDay(null)}
      title={`${viewYear}년 ${viewMonth + 1}월 ${selDay}일 점검 목록`} width={480}>
      {dayItems.map((it, i) => (
        <div key={i} style={{ padding: 12, marginBottom: 8, borderRadius: 8, border: `1px solid ${C.brd}`, background: "#F9FAFC" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 13, fontWeight: 600 }}>{it.resNm || it.title}</span>
            <Badge status={it.st} />
          </div>
          <div style={{ fontSize: 12, color: C.txS }}>
            <span style={{ padding: "1px 6px", borderRadius: 3, marginRight: 6,
              background: it._type === "일상" ? "#dcfce7" : "#fff7ed",
              color: it._type === "일상" ? "#166534" : "#c2410c", fontSize: 10 }}>{it._type}</span>
            {it.sysNm} · {it.kind || it.clNm} · {it.insp || ""}
          </div>
        </div>
      ))}
      {dayItems.length === 0 && <div style={{ textAlign: "center", color: C.txL, fontSize: 13, padding: 32 }}>점검 항목이 없습니다.</div>}
    </SidePanel>
  </div>;
};

const MgrInspSch = () => {
  const [showAdd, setShowAdd] = useState(false);
  const [selItem, setSelItem] = useState(null);
  return <div>
    <PH title="정기점검 스케줄" bc="홈 > 점검현황 > 정기점검 스케줄" />
    <SB ph="스케줄명으로 검색" />
    <Tbl secTitle="정기점검 스케줄 목록" secCount={SCH.length} secButtons={<SecBtnP onClick={() => setShowAdd(true)}>+ 정기점검 추가</SecBtnP>} cols={[
      { t: "상태", k: "useYn", w: 100, r: v => <YnBadge v={v} /> },
      { t: "스케줄명", k: "nm", w: 200, align: "left", r: (v, row) => <span onClick={e => { e.stopPropagation(); setSelItem(row); }} style={{ fontWeight: 600, color: C.pri, cursor: "pointer" }}>{v}</span> },
      { t: "주기", k: "freq" },
      { t: "실행시간", k: "autoTime", w: 90 },
      { t: "보고시간", k: "reportTime", w: 90 },
      { t: "자원수", k: "resCnt" }, { t: "다음 수행", k: "next" },
    ]} data={SCH} />
    <SchedulePanel open={showAdd} onClose={() => setShowAdd(false)} item={null} />
    <SchedulePanel open={!!selItem} onClose={() => setSelItem(null)} item={selItem} />
  </div>;
};

/* ── Inspection Filter Sidebar ── */
const _dailyMenu = [
  { k: null, l: "전체현황" },
  { k: "상태점검", l: "상태점검", c: ["서버","WEB","WAS","DBMS","네트워크","보안장비","스토리지","백업"] },
  { k: "유효성점검", l: "유효성점검" },
  { k: "서비스점검", l: "서비스점검" },
];
const _specMenu = [
  { k: null, l: "전체현황" },
  { k: "오프라인점검", l: "오프라인점검" },
  { k: "이중화점검", l: "이중화점검" },
  { k: "성능점검", l: "성능점검" },
  { k: "업무집중기간점검", l: "업무집중기간점검" },
];
const InspFilter = ({ menus, sel, sub, onSelect, data, kindKey = "kind", midKey = "mid" }) => {
  const [openK, setOpenK] = useState(null);
  const dCnt = (k, s) => {
    if (!data) return 0;
    return data.filter(x => { if (k && x[kindKey] !== k) return false; if (s && x[midKey] !== s) return false; return x.st === "지연"; }).length;
  };
  const badge = (cnt) => cnt > 0 ? <span style={{ minWidth: 18, height: 18, borderRadius: 9, background: C.red, color: "#fff", fontSize: 10, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "0 5px" }}>{cnt}</span> : null;
  const itemS = (active) => ({ padding: "9px 14px", borderRadius: 6, cursor: "pointer", marginBottom: 2, margin: "1px 6px", fontSize: 14, fontWeight: active ? 600 : 500, background: active ? C.priL : "", color: active ? C.sec : C.txt, transition: "all .3s" });
  const subS = (active) => ({ padding: "7px 12px 7px 28px", borderRadius: 6, cursor: "pointer", marginBottom: 1, margin: "0 6px", fontSize: 13, fontWeight: active ? 600 : 500, background: active ? C.priL : "", color: active ? C.sec : C.txS, transition: "all .3s" });
  return <div>
    {menus.map((m, i) => {
      const hasC = m.c && m.c.length > 0;
      const parentActive = sel === m.k && !sub;
      const childActive = hasC && sel === m.k && !!sub;
      const isOpen = hasC ? true : (openK === m.k || childActive);
      return <div key={i}>
        <div onClick={() => { if (hasC) { onSelect(m.k, null); } else { setOpenK(null); onSelect(m.k, null); } }}
          style={itemS(parentActive || childActive)}
          onMouseEnter={e => { if (!parentActive && !childActive) e.currentTarget.style.background = C.secL; }}
          onMouseLeave={e => { if (!parentActive && !childActive) e.currentTarget.style.background = ""; }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>{m.l}</span>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {badge(dCnt(m.k, null))}
              {hasC && <Ic n={isOpen ? "down" : "right"} s={10} c={C.txL} />}
            </div>
          </div>
        </div>
        {hasC && isOpen && <div style={{ marginBottom: 2 }}>
          {m.c.map(s => <div key={s} onClick={() => onSelect(m.k, s)} style={subS(sel === m.k && sub === s)}
            onMouseEnter={e => { if (!(sel === m.k && sub === s)) e.currentTarget.style.background = C.secL; }}
            onMouseLeave={e => { if (!(sel === m.k && sub === s)) e.currentTarget.style.background = ""; }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{s}</span>{badge(dCnt(m.k, s))}
            </div>
          </div>)}
        </div>}
      </div>;
    })}
  </div>;
};

const MgrInspD = () => {
  const [selItem, setSelItem] = useState(null);
  const [showReq, setShowReq] = useState(false);
  const [fKind, setFKind] = useState(null);
  const [fSub, setFSub] = useState(null);
  const filtered = DI.filter(x => {
    if (!fKind) return true;
    if (x.kind !== fKind) return false;
    if (fSub && x.mid !== fSub) return false;
    return true;
  });
  const title = fSub ? `${fKind} > ${fSub}` : fKind || "전체현황";
  return <div>
    <PH title="일상점검" bc="홈 > 점검현황 > 일상점검" />
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 14 }}>
      <Card title="점검종류" style={{ position: "sticky", top: 20, maxHeight: "calc(100vh - 170px)", overflow: "hidden", display: "flex", flexDirection: "column" }}><InspFilter menus={_dailyMenu} sel={fKind} sub={fSub} onSelect={(k, s) => { setFKind(k); setFSub(s); }} data={DI} /></Card>
      <div style={{ minWidth: 0 }}>
        <SB ph="자원명, 점검자로 검색" />
        <Tbl secTitle={title} secCount={filtered.length} secButtons={<SecBtnP onClick={() => setShowReq(true)}>+ 점검 등록</SecBtnP>} cols={[
          { t: "상태", k: "st", w: 100, r: v => <Badge status={v} /> },
          { t: "대상자원", k: "resNm", mw: 150, align: "left", r: (v, row) => <span onClick={e => { e.stopPropagation(); setSelItem(row); }} style={{ fontWeight: 600, color: C.pri, cursor: "pointer" }}>{v}</span> },
          { t: "점검표", k: "clNm", mw: 150, align: "left" },
          { t: "점검자", k: "insp" },
          { t: "수행일시", k: "execDt" },
          { t: "결과요약", k: "summary" },
          { t: "자동점검결과", k: "autoRes", r: v => v === "-" ? <span style={{color:C.txL}}>-</span> : <span style={{color: v==="정상"?"#479559":v==="비정상"?"#dc2626":"#ea580c", fontWeight:600}}>{v}</span> },
          { t: "육안점검결과", k: "eyeRes", r: v => v === "-" ? <span style={{color:C.txL}}>-</span> : <span style={{color: v==="정상"?"#479559":v==="비정상"?"#dc2626":"#ea580c", fontWeight:600}}>{v}</span> },
          { t: "제출일시", k: "submitDt" },
          { t: "비고", k: "memo" },
          { t: "점검 세부분류", k: "sub" },
          { t: "첨부파일", k: "hasFile", r: v => v ? <span style={{color:C.pri, cursor:"pointer"}}>📎</span> : "-" },
          { t: "재점검여부", k: "recheck", r: v => v === "Y" ? <span style={{color:"#dc2626",fontWeight:600}}>Y</span> : <span style={{color:C.txL}}>N</span> },
          { t: "일상점검 ID", k: "id" },
        ]} data={filtered} />
      </div>
    </div>
    <DailyReportPanel open={!!selItem} onClose={() => setSelItem(null)} item={selItem} />
    <DailyRequestPanel open={showReq} onClose={() => setShowReq(false)} />
  </div>;
};

const MgrInspSp = () => {
  const [selItem, setSelItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [fKind, setFKind] = useState(null);
  const filtered = fKind ? SI.filter(x => x.kind === fKind) : SI;
  const title = fKind || "전체현황";
  return <div>
    <PH title="특별점검" bc="홈 > 점검현황 > 특별점검" />
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 14 }}>
      <Card title="점검종류" style={{ position: "sticky", top: 20, maxHeight: "calc(100vh - 170px)", overflow: "hidden", display: "flex", flexDirection: "column" }}><InspFilter menus={_specMenu} sel={fKind} sub={null} onSelect={(k) => setFKind(k)} data={SI} /></Card>
      <div style={{ minWidth: 0 }}>
        <SB ph="제목, ID, 점검자 검색" />
        <Tbl secTitle={title} secCount={filtered.length} secButtons={<SecBtnP onClick={() => setShowAdd(true)}>+ 특별점검 추가</SecBtnP>} cols={[
          { t: "상태", k: "st", w: 100, r: v => <Badge status={v} /> },
          { t: "특별점검 제목", k: "title", mw: 250, align: "left", r: (v, row) => <span onClick={e => { e.stopPropagation(); setSelItem(row); }} style={{ fontWeight: 600, color: C.pri, cursor: "pointer" }}>{v}</span> },
          { t: "점검자", k: "insp" },
          { t: "점검기한", k: "due" },
          { t: "점검계획서", k: "planFile", r: v => v ? <span style={{color:C.pri, cursor:"pointer"}}>📎</span> : "-" },
          { t: "등록자", k: "regUser" },
          { t: "등록일", k: "reg" },
          { t: "점검목적", k: "purpose", r: v => <span style={{color: v==="-"?C.txL:C.txt}}>{v}</span> },
          { t: "특별점검내용", k: "content", r: v => <span style={{color: v==="-"?C.txL:C.txt}}>{v}</span> },
          { t: "수행일자", k: "execDt" },
          { t: "제출일시", k: "submitDt" },
          { t: "결과내용", k: "resultContent", r: v => <span style={{color: v==="-"?C.txL:C.txt}}>{v}</span> },
          { t: "결과첨부", k: "resultFile", r: v => v ? <span style={{color:C.pri, cursor:"pointer"}}>📎</span> : "-" },
          { t: "재점검여부", k: "recheck", r: v => v === "Y" ? <span style={{color:"#dc2626",fontWeight:600}}>Y</span> : <span style={{color:C.txL}}>N</span> },
          { t: "특별점검종류", k: "kind" },
          { t: "특별점검 ID", k: "id" },
        ]} data={filtered} />
      </div>
    </div>
    <SpecialPanel open={!!selItem} onClose={() => setSelItem(null)} item={selItem} />
    <SpecialPanel open={showAdd} onClose={() => setShowAdd(false)} item={null} />
  </div>;
};

const MgrHist = () => <div>
  <PH title="점검이력" bc="홈 > 점검현황 > 점검이력" />
  <SB />
  <Tbl secTitle="점검이력 목록" secCount={DI.filter(x => x.st === "완료").length} cols={[
    { t: "상태", k: "st", w: 100, r: v => <Badge status={v} /> },
    { t: "대상자원", k: "resNm", mw: 150, align: "left" }, { t: "정보시스템", k: "sysNm" },
    { t: "점검표", k: "clNm" }, { t: "수행일", k: "due" }, { t: "점검자", k: "insp" },
    { t: "자원 ID", k: "id" },
  ]} data={DI.filter(x => x.st === "완료")} />
</div>;

const MgrNotice = ({ readOnly }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [selItem, setSelItem] = useState(null);
  return <div>
    <PH title="공지사항" bc="홈 > 게시판 > 공지사항" />
    <SB ph="제목으로 검색" />
    <Tbl secTitle="공지사항 목록" secCount={NT.length} secButtons={!readOnly && <SecBtnP onClick={() => setShowAdd(true)}>+ 공지사항 등록</SecBtnP>} cols={[
      { t: "No", k: "id", w: 70 },
      { t: "제목", k: "title", mw: 300, align: "left", r: (v, row) => <span onClick={e => { e.stopPropagation(); setSelItem(row); }} style={{ fontWeight: 600, color: C.pri, cursor: "pointer" }}>{v}</span> },
      { t: "조회수", k: "views" }, { t: "작성자", k: "user" }, { t: "등록일", k: "dt" },
    ]} data={NT} />
    <NoticePanel open={showAdd} onClose={() => setShowAdd(false)} item={null} />
    <NoticePanel open={!!selItem} onClose={() => setSelItem(null)} item={selItem} />
  </div>;
};

/* ── 자료실 ── */
const LIB = [
  { id: 1, title: "2026년 정기점검 보고서 양식", views: 89, user: "김시스템", dt: "2026-01-08", file: "정기점검_보고서_양식_v2.xlsx" },
  { id: 2, title: "자원 등록 가이드 문서", views: 124, user: "김시스템", dt: "2026-01-12", file: "자원등록_가이드_v1.2.pdf" },
  { id: 3, title: "점검표 작성 매뉴얼", views: 76, user: "이기관", dt: "2026-01-18", file: "점검표_작성_매뉴얼.pdf" },
  { id: 4, title: "보안점검 체크리스트 (2026)", views: 158, user: "김시스템", dt: "2026-01-22", file: "보안점검_체크리스트_2026.xlsx" },
  { id: 5, title: "COMPLYSIGHT 사용자 매뉴얼 v2.0", views: 203, user: "김시스템", dt: "2026-01-28", file: "COMPLYSIGHT_사용자매뉴얼_v2.0.pdf" },
  { id: 6, title: "자동점검 설정 가이드", views: 67, user: "박유지보수", dt: "2026-02-01", file: "자동점검_설정가이드.pdf" },
  { id: 7, title: "네트워크 장비 점검 양식", views: 45, user: "김시스템", dt: "2026-02-05", file: "네트워크_점검양식.docx" },
  { id: 8, title: "이중화 점검 절차서", views: 91, user: "이기관", dt: "2026-02-07", file: "이중화_점검절차서_v1.1.pdf" },
  { id: 9, title: "업무집중기간 점검 계획서 템플릿", views: 38, user: "이기관", dt: "2026-02-09", file: "업무집중기간_점검계획서.docx" },
  { id: 10, title: "라이선스 관리 정책 문서", views: 52, user: "김시스템", dt: "2026-02-10", file: "라이선스_관리정책.pdf" },
];
const MgrLibrary = ({ readOnly }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [selItem, setSelItem] = useState(null);
  return <div>
    <PH title="자료실" bc="홈 > 게시판 > 자료실" />
    <SB ph="제목으로 검색" />
    <Tbl secTitle="자료실 목록" secCount={LIB.length} secButtons={!readOnly && <SecBtnP onClick={() => setShowAdd(true)}>+ 자료 등록</SecBtnP>} cols={[
      { t: "No", k: "id", w: 70 },
      { t: "제목", k: "title", mw: 300, align: "left", r: (v, row) => <span onClick={e => { e.stopPropagation(); setSelItem(row); }} style={{ fontWeight: 600, color: C.pri, cursor: "pointer" }}>{v}</span> },
      { t: "첨부파일", k: "file", mw: 300, align: "left", r: v => v ? <span style={{ color: C.pri, cursor: "pointer" }}>📎 {v}</span> : "—" },
      { t: "조회수", k: "views" }, { t: "작성자", k: "user" }, { t: "등록일", k: "dt" },
    ]} data={LIB} />
    <NoticePanel open={showAdd} onClose={() => setShowAdd(false)} item={null} />
    <NoticePanel open={!!selItem} onClose={() => setSelItem(null)} item={selItem} />
  </div>;
};

const UserPanel = ({ open, onClose, user, groups }) => {
  const isNew = !user;
  const emptyForm = { st: "Y", userId: "", userNm: "", email: "", password: "", role: "사용자", systems: [], lockedYn: "N", groupId: "", phone: "", memo: "" };
  const [form, setForm] = useState(emptyForm);
  const [editMode, setEditMode] = useState(false);
  const [pwResetDone, setPwResetDone] = useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  useEffect(() => {
    if (open && user) {
      setForm({ st: user.useYn || "Y", userId: user.userId, userNm: user.userNm, email: user.email, password: "", role: user.userRole, systems: [], lockedYn: "N", groupId: user.groupId || "", phone: user.phone || "", memo: "" });
      setEditMode(false); setPwResetDone(false);
    }
    if (open && !user) { setForm(emptyForm); setEditMode(false); setPwResetDone(false); }
  }, [open, user]);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const ro = !!user && !editMode;
  const roS  = ro ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none" } : {};
  const roSel = ro ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none", appearance: "none", backgroundImage: "none", cursor: "default" } : {};

  const handleSave = () => { setEditMode(false); if (isNew) onClose(); };
  const handleCancel = () => { if (editMode) setConfirmOpen(true); else onClose(); };
  const handlePwReset = () => { setPwResetDone(true); setTimeout(() => setPwResetDone(false), 3000); };

  return (
    <>
    <UnsavedConfirm open={confirmOpen} onDiscard={() => { setConfirmOpen(false); setEditMode(false); onClose(); }} onSave={() => { setConfirmOpen(false); setEditMode(false); }} />
    <SidePanel open={open} onClose={() => editMode ? setConfirmOpen(true) : onClose()} title={isNew ? "사용자 등록" : "사용자 상세"} width={580}>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginBottom: 16, marginTop: -6 }}>
        {!isNew && !editMode && <button onClick={() => {}} style={{ padding: "5px 14px", fontSize: 12, fontWeight: 600, border: "1px solid #fca5a5", borderRadius: 6, background: "#fef2f2", color: "#ef4444", cursor: "pointer" }}>삭제</button>}
        {!isNew && !editMode && <button onClick={() => setEditMode(true)} style={{ padding: "5px 14px", fontSize: 12, fontWeight: 600, border: `1px solid ${C.pri}`, borderRadius: 6, background: C.priL, color: C.pri, cursor: "pointer" }}>수정</button>}
      </div>

      {/* 계정 정보 */}
      <div style={{ marginBottom: 18 }}>
        <SecTitle label="계정 정보" primary />

        {/* ① 사용자 명 + 이메일 — 최상단 */}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="사용자 명" required half>
            <input style={{ ...fInput, ...roS }} value={form.userNm} onChange={e => set("userNm", e.target.value)} placeholder="실명" readOnly={ro} maxLength={50} />
          </FormRow>
          <FormRow label="이메일" required half>
            <input type="email" style={{ ...fInput, ...roS }} value={form.email} onChange={e => set("email", e.target.value)} placeholder="user@example.com" readOnly={ro} maxLength={254} />
          </FormRow>
        </div>

        {/* ② 사용자 ID + 비밀번호 */}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="사용자 ID" required half>
            <input style={{ ...fInput, ...(ro || !isNew ? roS : {}) }} value={form.userId} onChange={e => set("userId", e.target.value.replace(/[^a-zA-Z0-9]/g, ""))} placeholder="영문/숫자" readOnly={ro || !isNew} maxLength={20} />
          </FormRow>
          <FormRow label="비밀번호" required={isNew} half>
            {ro ? (
              /* 상세 모드: 암호화 표시만 (초기화 버튼 없음) */
              <input
                value="••••••••••••"
                readOnly
                style={{ ...fInput, ...roS, letterSpacing: 2, color: C.txL, fontFamily: "monospace" }}
              />
            ) : editMode ? (
              /* 수정 모드: 초기화 버튼만 */
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <input
                  value="••••••••••••"
                  readOnly
                  style={{ ...fInput, flex: 1, letterSpacing: 2, color: C.txL, fontFamily: "monospace", background: "#F9FAFC", pointerEvents: "none" }}
                />
                <button
                  onClick={handlePwReset}
                  style={{
                    flexShrink: 0,
                    padding: "7px 10px", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
                    border: `1px solid ${pwResetDone ? "#bbf7d0" : C.brd}`,
                    borderRadius: 6,
                    background: pwResetDone ? "#f0fdf4" : "#fff",
                    color: pwResetDone ? "#16a34a" : C.txS,
                    cursor: "pointer", transition: "all .3s"
                  }}>
                  {pwResetDone ? "✓ 완료" : "초기화"}
                </button>
              </div>
            ) : (
              /* 신규 등록 모드: 직접 입력 */
              <input type="password" style={fInput} value={form.password} onChange={e => set("password", e.target.value)} placeholder="비밀번호 입력" maxLength={72} />
            )}
          </FormRow>
        </div>

        {/* ③ 상태 + 역할 */}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="상태" half>
            <RoSelect readOnly={ro} style={{ ...fSelect, ...roSel }} value={form.st} onChange={e => set("st", e.target.value)}>
              <option value="Y">사용</option><option value="N">미사용</option>
            </RoSelect>
          </FormRow>
          <FormRow label="역할" half>
            <RoSelect readOnly={ro} style={{ ...fSelect, ...roSel }} value={form.role} onChange={e => set("role", e.target.value)}>
              {["시스템 관리자","기관 관리자","유지보수 총괄","사용자"].map(r => <option key={r} value={r}>{r}</option>)}
            </RoSelect>
          </FormRow>
        </div>

        {/* ④ 연락처 + 계정 잠김 */}
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="연락처" half>
            <input style={{ ...fInput, ...roS }} value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="010-0000-0000" readOnly={ro} maxLength={20} />
          </FormRow>
          <FormRow label="계정 잠김" half>
            <RoSelect readOnly={ro} style={{ ...fSelect, ...roSel }} value={form.lockedYn} onChange={e => set("lockedYn", e.target.value)}>
              <option value="N">No</option><option value="Y">Yes</option>
            </RoSelect>
          </FormRow>
        </div>

        {/* ⑤ 그룹 */}
        <FormRow label="그룹">
          {ro ? (
            <div style={{ ...fInput, background: "#F9FAFC", color: form.groupId ? C.txt : C.txL, userSelect: "none" }}>
              {form.groupId ? (groups || []).find(g => g.id === form.groupId)?.nm || form.groupId : "그룹 없음"}
            </div>
          ) : (
            <select style={{ ...fSelect }} value={form.groupId} onChange={e => set("groupId", e.target.value)}>
              <option value="">그룹 없음</option>
              {(groups || []).map(g => <option key={g.id} value={g.id}>{g.nm}</option>)}
            </select>
          )}
        </FormRow>
      </div>

      {/* 접속 정보 (조회 시만) */}
      {user && <div style={{ marginBottom: 18 }}>
        <SecTitle label="접속 정보" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px", fontSize: 12 }}>
          <div><span style={{ color: C.txS }}>생성일: </span>{user.regDt || "2026-01-01 09:00"}</div>
          <div><span style={{ color: C.txS }}>마지막 로그인: </span>{user.lastLoginDt || "—"}</div>
          <div><span style={{ color: C.txS }}>비밀번호 변경일: </span>{user.pwChangeDt || "—"}</div>
          <div><span style={{ color: C.txS }}>로그인 실패: </span>{user.loginFailCnt || 0}회</div>
        </div>
      </div>}

      {/* 소속 정보시스템 */}
      <div style={{ marginBottom: 18 }}>
        <SecTitle label="소속 정보시스템" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
          {form.systems.length === 0 && <span style={{ fontSize: 12, color: C.txL }}>소속 정보시스템이 없습니다.</span>}
          {form.systems.map(sid => { const s = SYS.find(x => x.id === sid); return s ? <span key={sid} style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 12, background: C.priL, color: C.priD, fontSize: 12 }}>{s.nm} {!ro && <span onClick={() => set("systems", form.systems.filter(x => x !== sid))} style={{ cursor: "pointer" }}>×</span>}</span> : null; })}
        </div>
        {!ro && <select style={{ ...fSelect, maxWidth: 280 }} value="" onChange={e => { if (e.target.value && !form.systems.includes(e.target.value)) set("systems", [...form.systems, e.target.value]); }}>
          <option value="">+ 정보시스템 추가</option>
          {SYS.filter(s => !form.systems.includes(s.id)).map(s => <option key={s.id} value={s.id}>{s.nm}</option>)}
        </select>}
      </div>

      {/* 기타 */}
      <div style={{ marginBottom: 18 }}>
        <SecTitle label="기타" />
        <FormRow label="비고">
          <textarea style={{ ...fTextarea, ...(ro ? { ...roS, resize: "none" } : {}) }} value={form.memo} onChange={e => set("memo", e.target.value)} placeholder="기타 메모" readOnly={ro} maxLength={500} />
        </FormRow>
      </div>

      {(isNew || editMode) && <PanelFooter onCancel={handleCancel} onSave={handleSave} saveLabel={isNew ? "등록" : "저장"} />}
      {ro && <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 16, borderTop: `1px solid ${C.brd}` }}><Btn onClick={onClose}>닫기</Btn></div>}
    </SidePanel>
    </>
  );
};

/* ── 그룹관리 레이어 팝업 ── */
const GroupMgmtModal = ({ open, onClose, groups, setGroups, users }) => {
  const [search,   setSearch]   = useState("");
  const [editId,   setEditId]   = useState(null);   // 수정 중인 그룹 id
  const [editNm,   setEditNm]   = useState("");
  const [newNm,    setNewNm]    = useState("");
  const [errMsg,   setErrMsg]   = useState("");

  useEffect(() => { if (!open) { setSearch(""); setEditId(null); setNewNm(""); setErrMsg(""); } }, [open]);

  const usedIds = new Set((users || []).map(u => u.groupId).filter(Boolean));
  const filtered = groups.filter(g => g.nm.includes(search.trim()));

  /* 등록 */
  const addGroup = () => {
    const nm = newNm.trim();
    if (!nm) { setErrMsg("그룹명을 입력하세요."); return; }
    if (groups.some(g => g.nm === nm)) { setErrMsg("이미 등록된 그룹명입니다."); return; }
    const id = "GRP" + String(Date.now()).slice(-6);
    const today = new Date().toISOString().slice(0, 10);
    setGroups(prev => [...prev, { id, nm, regDt: today }]);
    setNewNm(""); setErrMsg("");
  };

  /* 수정 시작 */
  const startEdit = (g) => { setEditId(g.id); setEditNm(g.nm); setErrMsg(""); };

  /* 수정 저장 */
  const saveEdit = () => {
    const nm = editNm.trim();
    if (!nm) { setErrMsg("그룹명을 입력하세요."); return; }
    if (groups.some(g => g.nm === nm && g.id !== editId)) { setErrMsg("이미 등록된 그룹명입니다."); return; }
    setGroups(prev => prev.map(g => g.id === editId ? { ...g, nm } : g));
    setEditId(null); setEditNm(""); setErrMsg("");
  };

  /* 삭제 */
  const delGroup = (g) => {
    if (usedIds.has(g.id)) { setErrMsg(`'${g.nm}'은 사용 중인 그룹으로 삭제할 수 없습니다.`); return; }
    setGroups(prev => prev.filter(x => x.id !== g.id));
    setErrMsg("");
  };

  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {/* 딤 */}
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.45)" }} onClick={onClose} />
      {/* 팝업 */}
      <div style={{ position: "relative", width: 480, background: "#fff", borderRadius: 14, boxShadow: "0 20px 60px rgba(0,0,0,.2)", display: "flex", flexDirection: "column", maxHeight: "80vh" }}>
        {/* 헤더 */}
        <div style={{ padding: "18px 22px 14px", borderBottom: `1px solid ${C.brd}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: C.txt }}>그룹 관리</div>
            <div style={{ fontSize: 11, color: C.txL, marginTop: 2 }}>그룹을 추가·수정·삭제하고 사용자에게 적용합니다.</div>
          </div>
          <button onClick={onClose} style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer", color: C.txL, lineHeight: 1 }}>×</button>
        </div>

        {/* 검색 + 목록 */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", padding: "16px 22px 0" }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="그룹명 검색"
            style={{ ...fInput, marginBottom: 10 }} />

          {/* 오류 메시지 */}
          {errMsg && <div style={{ fontSize: 12, color: "#ef4444", background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 6, padding: "7px 12px", marginBottom: 10 }}>{errMsg}</div>}

          <div style={{ flex: 1, overflowY: "auto", marginRight: -4, paddingRight: 4 }}>
            {filtered.length === 0 && (
              <div style={{ textAlign: "center", padding: "40px 0", color: C.txL, fontSize: 13 }}>
                {search ? "검색 결과가 없습니다." : "등록된 그룹이 없습니다."}
              </div>
            )}
            {filtered.map(g => {
              const inUse = usedIds.has(g.id);
              const isEditing = editId === g.id;
              return (
                <div key={g.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 10px", borderRadius: 8, marginBottom: 4,
                  background: isEditing ? C.priL : "#f8fafc", border: `1px solid ${isEditing ? C.pri : C.brd}` }}>
                  {isEditing ? (
                    <>
                      <input value={editNm} onChange={e => setEditNm(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && saveEdit()}
                        autoFocus style={{ ...fInput, flex: 1, margin: 0 }} />
                      <button onClick={saveEdit} style={{ padding: "4px 12px", fontSize: 12, fontWeight: 600, border: `1px solid ${C.pri}`, borderRadius: 6, background: C.pri, color: "#fff", cursor: "pointer", whiteSpace: "nowrap" }}>저장</button>
                      <button onClick={() => { setEditId(null); setErrMsg(""); }} style={{ padding: "4px 10px", fontSize: 12, border: `1px solid ${C.brd}`, borderRadius: 6, background: "#fff", color: C.txS, cursor: "pointer" }}>취소</button>
                    </>
                  ) : (
                    <>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: C.txt }}>{g.nm}</div>
                        <div style={{ fontSize: 11, color: C.txL, marginTop: 1 }}>등록일 {g.regDt} {inUse && <span style={{ color: C.pri, fontWeight: 600, marginLeft: 6 }}>사용 중</span>}</div>
                      </div>
                      <button onClick={() => startEdit(g)} style={{ padding: "3px 10px", fontSize: 11, fontWeight: 600, border: `1px solid ${C.brd}`, borderRadius: 5, background: "#fff", color: C.txS, cursor: "pointer" }}>수정</button>
                      <button onClick={() => delGroup(g)} style={{ padding: "3px 10px", fontSize: 11, fontWeight: 600, border: `1px solid ${inUse ? "#e2e8f0" : "#fca5a5"}`, borderRadius: 5, background: "#fff", color: inUse ? "#cbd5e1" : "#ef4444", cursor: inUse ? "not-allowed" : "pointer" }}>삭제</button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 신규 등록 영역 */}
        <div style={{ padding: "14px 22px 20px", borderTop: `1px solid ${C.brd}`, flexShrink: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 400, color: C.txL, marginBottom: 6 }}>신규 그룹 등록</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input value={newNm} onChange={e => { setNewNm(e.target.value); setErrMsg(""); }}
              onKeyDown={e => e.key === "Enter" && addGroup()}
              placeholder="그룹명 입력 후 Enter 또는 등록 버튼 클릭"
              style={{ ...fInput, flex: 1 }} maxLength={50} />
            <Btn primary onClick={addGroup}>등록</Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

const MgrUsers = () => {
  const [users,       setUsers]       = useState(USERS);
  const [groups,      setGroups]      = useState(INIT_USER_GROUPS);
  const [selGroup,    setSelGroup]    = useState(null);   // 왼쪽 선택 그룹 (null=전체)
  const [selUser,     setSelUser]     = useState(null);
  const [showAdd,     setShowAdd]     = useState(false);
  const [showGrpMgmt, setShowGrpMgmt] = useState(false);
  const [keyword,     setKeyword]     = useState("");

  /* 왼쪽 패널: 그룹별 사용자 수 */
  const countByGroup = (gid) => users.filter(u => u.groupId === gid).length;
  const ungrouped    = users.filter(u => !u.groupId).length;

  /* 오른쪽 목록 필터 */
  const filtered = users.filter(u => {
    const kw = keyword.trim().toLowerCase();
    if (kw && !u.userNm.toLowerCase().includes(kw) && !u.userId.toLowerCase().includes(kw) && !(u.email||"").toLowerCase().includes(kw)) return false;
    if (selGroup === "__NONE__") return !u.groupId;
    if (selGroup) return u.groupId === selGroup;
    return true;
  });

  /* 선택 그룹 이름 */
  const selGroupNm = selGroup === "__NONE__" ? "미지정" : groups.find(g => g.id === selGroup)?.nm || "전체";

  return (
    <div>
      <PH title="사용자" bc="홈 > 환경설정 > 사용자 관리 > 사용자" />

      <div style={{ display: "flex", gap: 14, alignItems: "start" }}>

        {/* ── 왼쪽: 그룹 패널 ── */}
        <div style={{ width: 240, flexShrink: 0, background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 6, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.brd}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: C.txH }}>그룹</span>
            <button onClick={() => setShowGrpMgmt(true)}
              style={{ fontSize: 11, fontWeight: 500, color: C.pri, background: "none", border: `1px solid ${C.pri}`, borderRadius: 5, padding: "3px 8px", cursor: "pointer" }}>관리</button>
          </div>
          <div style={{ padding: "6px 0" }}>
            {/* 전체 */}
            {(() => {
              const active = selGroup === null;
              return (
                <div onClick={() => setSelGroup(null)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "9px 14px", cursor: "pointer", borderRadius: 6, margin: "0 6px",
                    background: active ? C.priL : "transparent",
                    transition: "all .3s" }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.secL; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? C.priL : "transparent"; }}>
                  <span style={{ fontSize: 14, fontWeight: active ? 600 : 500, color: active ? C.sec : C.txt }}>전체</span>
                  <span style={{ fontSize: 11, fontWeight: 500,
                    background: "#EEEEEE", color: "#929292",
                    borderRadius: 10, padding: "1px 7px", minWidth: 20, textAlign: "center" }}>{users.length}</span>
                </div>
              );
            })()}
            {/* 그룹 목록 */}
            {groups.map(g => {
              const active = selGroup === g.id;
              const cnt = countByGroup(g.id);
              return (
                <div key={g.id} onClick={() => setSelGroup(g.id)}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "9px 14px", cursor: "pointer", borderRadius: 6, margin: "1px 6px",
                    background: active ? C.priL : "transparent",
                    transition: "all .3s" }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.secL; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? C.priL : "transparent"; }}>
                  <span style={{ fontSize: 14, fontWeight: active ? 600 : 500, color: active ? C.sec : C.txt,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, marginRight: 6 }}>{g.nm}</span>
                  <span style={{ fontSize: 11, fontWeight: 500,
                    background: "#EEEEEE", color: "#929292",
                    borderRadius: 10, padding: "1px 7px", minWidth: 20, textAlign: "center", flexShrink: 0 }}>{cnt}</span>
                </div>
              );
            })}
            {/* 미지정 */}
            {ungrouped > 0 && (() => {
              const active = selGroup === "__NONE__";
              return (
                <div onClick={() => setSelGroup("__NONE__")}
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "9px 14px", cursor: "pointer", borderRadius: 6, margin: "1px 6px",
                    borderTop: `1px dashed ${C.brd}`, marginTop: 4,
                    background: active ? C.priL : "transparent",
                    transition: "all .3s" }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = C.secL; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = active ? C.priL : "transparent"; }}>
                  <span style={{ fontSize: 14, fontWeight: active ? 600 : 500, color: active ? C.sec : C.txL }}>미지정</span>
                  <span style={{ fontSize: 11, fontWeight: 500,
                    background: "#EEEEEE", color: "#929292",
                    borderRadius: 10, padding: "1px 7px", minWidth: 20, textAlign: "center" }}>{ungrouped}</span>
                </div>
              );
            })()}
          </div>
        </div>

        {/* ── 오른쪽: 사용자 목록 ── */}
        <div style={{ flex: 1 }}>

          {/* 검색폼 (searchform) */}
          <div style={{ width: "100%", border: `1px solid ${C.brd}`, background: C.bg, borderRadius: 6, padding: "16px 12px", display: "flex", gap: 8, marginBottom: 16, alignItems: "stretch" }}>
            <div style={{ display: "flex", flex: 1, gap: 16, flexWrap: "wrap", alignItems: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.txS }}>이름·ID·이메일</span>
                <input value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="이름, ID, 이메일 검색"
                  style={{ padding: "6px 12px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 15, outline: "none", color: C.txt, background: "#fff", minHeight: 36, width: 240, fontFamily: "inherit" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: C.txS }}>상태</span>
                <select style={{ padding: "6px 12px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 15, background: "#fff", color: C.txt, minHeight: 36, fontFamily: "inherit" }}>
                  <option>전체</option><option>사용</option><option>미사용</option>
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, alignItems: "stretch" }}>
              <button style={{ background: "#fff", border: `1px solid ${C.sec}`, color: C.sec, borderRadius: 4, padding: "0 24px", fontSize: 15, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", minWidth: 60, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s" }}
                onMouseEnter={e => { e.currentTarget.style.background = C.sec; e.currentTarget.style.color = "#fff"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = C.sec; }}>검색</button>
              <button onClick={() => setKeyword("")} title="검색 초기화" style={{ background: C.priL, border: `1px solid ${C.pri}40`, borderRadius: 4, padding: "0 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", minWidth: 40 }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 2v4h-4" stroke={C.pri} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.5 10a6 6 0 11-1.3-6.3L14 6" stroke={C.pri} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          </div>

          {/* sec-title */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingTop: 38, paddingBottom: 8, borderBottom: `1px solid ${C.brdD}`, marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: C.txH }}>{selGroupNm} 사용자 목록</span>
              <span style={{ fontSize: 12, color: C.txL }}>{filtered.length}명</span>
            </div>
            <SecBtnP onClick={() => setShowAdd(true)}>+ 사용자 등록</SecBtnP>
          </div>

          {/* 테이블 */}
          <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: "100%", width: "max-content", borderCollapse: "collapse", fontSize: 15, borderBottom: `1px solid ${C.brd}` }}>
            <thead>
              <tr style={{ borderTop: `1px solid ${C.txH}` }}>
                {[["상태",100],["사용자 ID",150],["이름",150],["이메일","auto"],["그룹",100],["역할",110],["마지막 로그인",140]].map(([h,w],i) => (
                  <th key={i} style={{ padding: "9px 12px", borderBottom: `1px solid ${C.brdD}`, textAlign: (i===1||i===2) ? "left" : "center", fontSize: 14, fontWeight: 400, color: C.txL, whiteSpace: "nowrap", verticalAlign: "middle", ...(typeof w === "number" ? {width:w} : {}), ...((i===1||i===2) ? {minWidth:w} : {}) }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => {
                const grp = groups.find(g => g.id === u.groupId);
                return (
                  <tr key={u.userId} style={{ cursor: "pointer" }}
                    onClick={() => setSelUser(u)}
                    onMouseEnter={e => e.currentTarget.style.background = C.secL}
                    onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle", width: 100 }}><YnBadge v={u.useYn} /></td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "left", verticalAlign: "middle", color: C.txS, fontFamily: "monospace", fontSize: 13, minWidth: 150 }}>{u.userId}</td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "left", verticalAlign: "middle", fontWeight: 600, color: C.pri, minWidth: 150 }}>{u.userNm}</td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle", color: C.txt, fontSize: 13 }}>{u.email || "—"}</td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle" }}>
                      {grp ? (
                        <span style={{ padding: "2px 9px", borderRadius: 10, fontSize: 11, fontWeight: 600, background: C.priL, color: C.pri, border: `1px solid ${C.priL}` }}>{grp.nm}</span>
                      ) : <span style={{ color: C.txL, fontSize: 12 }}>—</span>}
                    </td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle" }}><RoleBadge v={u.userRole} /></td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle", color: C.txL, fontSize: 12 }}>{u.lastLoginDt || "—"}</td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={7} style={{ padding: 48, textAlign: "center", color: C.txL, fontSize: 13 }}>사용자가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* 그룹 관리 팝업 */}
      <GroupMgmtModal open={showGrpMgmt} onClose={() => setShowGrpMgmt(false)} groups={groups} setGroups={setGroups} users={users} />

      {/* 사용자 상세/등록 패널 */}
      <UserPanel open={showAdd}    onClose={() => setShowAdd(false)}  user={null}    groups={groups} />
      <UserPanel open={!!selUser}  onClose={() => setSelUser(null)}   user={selUser} groups={groups} />
    </div>
  );
};

const _clEmptyForm = { st: "Y", nm: "", clId: "", inspType: "일상점검", inspKind: "", exposedRes: [], linkedSch: 0, linkedRes: 0, registrant: "", regDt: "", purpose: "", memo: "" };
const ChecklistPanel = ({ open, onClose, item }) => {
  const isNew = !item;
  const [form, setForm] = useState(_clEmptyForm);
  useEffect(() => {
    if (open && item) setForm({ st: item.useYn || "Y", nm: item.nm, clId: item.id || "", inspType: item.type || "일상점검", inspKind: item.kind || "상태점검", exposedRes: [], linkedSch: item.sch || 0, linkedRes: 0, registrant: "관리자", regDt: "2026-01-15 10:00:00", purpose: "", memo: "" });
    if (open && !item) setForm(_clEmptyForm);
  }, [open, item]);
  const [editMode, setEditMode] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [kindChangeConfirm, setKindChangeConfirm] = useState(null); /* 점검세부분류 변경 시 대기값 */
  const [itemFilter, setItemFilter] = useState(""); /* 추가 가능 항목 키워드 필터 */
  useEffect(() => { if (open) { setEditMode(false); setConfirmOpen(false); setKindChangeConfirm(null); setItemFilter(""); } }, [open]);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const ro = !!item && !editMode;
  const roS = ro ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none" } : {};
  const roSel = ro ? { background: "#F9FAFC", color: C.txt, pointerEvents: "none", appearance: "none", backgroundImage: "none", cursor: "default" } : {};
  const handleSave = () => { setEditMode(false); };
  const handleCancel = () => { if (editMode) setConfirmOpen(true); else onClose(); };
  const handleDiscard = () => { setConfirmOpen(false); setEditMode(false); onClose(); };
  const handleSaveConfirm = () => { setConfirmOpen(false); setEditMode(false); };
  const inspKindOptions = { "일상점검": ["상태점검","유효성점검","서비스점검"], "특별점검": ["오프라인점검","이중화점검","성능점검","업무집중기간점검"] };
  const resInfoOptions = [
    // 기본 정보
    "자원명", "자원 식별코드", "중분류", "소분류", "상위 자원명", "관리주체", "운영/개발 구분", "도입일", "가상화 여부",
    // 용도 정보
    "사용용도", "최초 사용용도", "이전 사용용도", "상세용도",
    // 네트워크 정보
    "장비 IP", "서비스 IP", "포트",
    // 서비스 정보
    "서비스 URL", "설치경로", "로그경로",
    // SNMP
    "SNMP 계정정보", "SNMP 버전", "SNMP 인증정보",
    // 하드웨어/시스템
    "OS", "제조사", "모델명", "시리얼넘버", "메모리 용량(GB)", "로컬 디스크 용량(GB)", "CPU 모델", "CPU 클럭 속도(GHz)", "CPU 코어수", "CPU 아키텍처",
    // 기타
    "비고",
  ];

  /* 검증코드 풀 (선택 가능한 항목 목록) */
  const vcPool = [
    /* 서버 > CPU */
    { code: "CHK-CPU-001", nm: "CPU 사용률", method: "자동", std: "< 80%", unit: "%", cat1: "서버", cat2: "CPU", cat3: "사용률" },
    { code: "CHK-CPU-002", nm: "CPU 코어별 사용률", method: "자동", std: "< 90%", unit: "%", cat1: "서버", cat2: "CPU", cat3: "코어별" },
    { code: "CHK-CPU-003", nm: "CPU 대기 큐 길이", method: "자동", std: "< 10", unit: "개", cat1: "서버", cat2: "CPU", cat3: "대기 큐" },
    /* 서버 > 메모리 */
    { code: "CHK-MEM-001", nm: "메모리 사용률", method: "자동", std: "< 85%", unit: "%", cat1: "서버", cat2: "메모리", cat3: "사용률" },
    { code: "CHK-MEM-002", nm: "SWAP 사용률", method: "자동", std: "< 50%", unit: "%", cat1: "서버", cat2: "메모리", cat3: "SWAP" },
    { code: "CHK-MEM-003", nm: "캐시 메모리 상태", method: "자동", std: "정상", unit: "", cat1: "서버", cat2: "메모리", cat3: "캐시" },
    /* 서버 > 디스크 */
    { code: "CHK-DISK-001", nm: "디스크 사용률", method: "자동", std: "< 90%", unit: "%", cat1: "서버", cat2: "디스크", cat3: "사용률" },
    { code: "CHK-DISK-002", nm: "디스크 I/O 대기", method: "자동", std: "< 20%", unit: "%", cat1: "서버", cat2: "디스크", cat3: "I/O" },
    { code: "CHK-DISK-003", nm: "inode 사용률", method: "자동", std: "< 80%", unit: "%", cat1: "서버", cat2: "디스크", cat3: "inode" },
    { code: "CHK-DISK-004", nm: "파일시스템 상태", method: "자동", std: "정상", unit: "", cat1: "서버", cat2: "디스크", cat3: "파일시스템" },
    /* 서버 > 프로세스 */
    { code: "CHK-PROC-001", nm: "주요 프로세스 구동 확인", method: "자동", std: "Running", unit: "", cat1: "서버", cat2: "프로세스", cat3: "구동상태" },
    { code: "CHK-PROC-002", nm: "좀비 프로세스 수", method: "자동", std: "0", unit: "개", cat1: "서버", cat2: "프로세스", cat3: "좀비" },
    { code: "CHK-PROC-003", nm: "프로세스 수 한계", method: "자동", std: "< 500", unit: "개", cat1: "서버", cat2: "프로세스", cat3: "한계" },
    /* 서버 > 서비스 */
    { code: "CHK-SVC-001", nm: "서비스 포트 확인", method: "자동", std: "OPEN", unit: "", cat1: "서버", cat2: "서비스", cat3: "포트" },
    { code: "CHK-SVC-002", nm: "SSH 서비스 상태", method: "자동", std: "Active", unit: "", cat1: "서버", cat2: "서비스", cat3: "SSH" },
    { code: "CHK-SVC-003", nm: "NTP 동기화 상태", method: "자동", std: "동기화", unit: "", cat1: "서버", cat2: "서비스", cat3: "NTP" },
    { code: "CHK-SVC-004", nm: "DNS 응답 확인", method: "자동", std: "정상", unit: "", cat1: "서버", cat2: "서비스", cat3: "DNS" },
    /* 서버 > OS */
    { code: "CHK-OS-001", nm: "OS 커널 버전 확인", method: "자동", std: "최신", unit: "", cat1: "서버", cat2: "OS", cat3: "커널" },
    { code: "CHK-OS-002", nm: "시스템 가동시간(Uptime)", method: "자동", std: "> 0", unit: "일", cat1: "서버", cat2: "OS", cat3: "Uptime" },
    { code: "CHK-OS-003", nm: "시스템 시간 정확도", method: "자동", std: "< 1초", unit: "초", cat1: "서버", cat2: "OS", cat3: "시간" },
    /* 서버 > 로그 */
    { code: "CHK-LOG-001", nm: "로그 에러 확인", method: "육안", std: "0건", unit: "건", cat1: "서버", cat2: "로그", cat3: "에러" },
    { code: "CHK-LOG-002", nm: "시스템 로그 용량", method: "자동", std: "< 1GB", unit: "GB", cat1: "서버", cat2: "로그", cat3: "용량" },
    { code: "CHK-LOG-003", nm: "감사 로그 기록 확인", method: "육안", std: "정상", unit: "", cat1: "서버", cat2: "로그", cat3: "감사" },
    { code: "CHK-LOG-004", nm: "로그 로테이션 상태", method: "자동", std: "정상", unit: "", cat1: "서버", cat2: "로그", cat3: "로테이션" },
    /* 보안 > 패치 */
    { code: "CHK-PATCH-001", nm: "보안패치 상태", method: "육안", std: "최신", unit: "", cat1: "보안", cat2: "패치", cat3: "상태" },
    { code: "CHK-PATCH-002", nm: "긴급 보안패치 적용 여부", method: "육안", std: "적용", unit: "", cat1: "보안", cat2: "패치", cat3: "긴급" },
    /* 보안 > 접근통제 */
    { code: "CHK-SEC-001", nm: "방화벽 룰 점검", method: "육안", std: "정상", unit: "", cat1: "보안", cat2: "접근통제", cat3: "방화벽" },
    { code: "CHK-SEC-002", nm: "불필요 포트 오픈 확인", method: "자동", std: "0", unit: "개", cat1: "보안", cat2: "접근통제", cat3: "포트" },
    { code: "CHK-SEC-003", nm: "root 원격접속 제한", method: "자동", std: "차단", unit: "", cat1: "보안", cat2: "접근통제", cat3: "원격접속" },
    { code: "CHK-SEC-009", nm: "암호화 통신 설정", method: "자동", std: "TLS 1.2+", unit: "", cat1: "보안", cat2: "접근통제", cat3: "암호화" },
    { code: "CHK-SEC-010", nm: "IPS/IDS 정책 상태", method: "육안", std: "정상", unit: "", cat1: "보안", cat2: "접근통제", cat3: "IPS/IDS" },
    /* 보안 > 계정관리 */
    { code: "CHK-SEC-004", nm: "패스워드 정책 준수", method: "자동", std: "준수", unit: "", cat1: "보안", cat2: "계정관리", cat3: "패스워드" },
    { code: "CHK-SEC-005", nm: "계정 잠김 정책 확인", method: "자동", std: "설정", unit: "", cat1: "보안", cat2: "계정관리", cat3: "잠김정책" },
    { code: "CHK-SEC-006", nm: "세션 타임아웃 설정", method: "자동", std: "설정", unit: "", cat1: "보안", cat2: "계정관리", cat3: "세션" },
    { code: "CHK-SEC-007", nm: "불필요 계정 존재 확인", method: "육안", std: "0", unit: "개", cat1: "보안", cat2: "계정관리", cat3: "불필요계정" },
    { code: "CHK-SEC-008", nm: "권한 설정 적정성", method: "육안", std: "적정", unit: "", cat1: "보안", cat2: "계정관리", cat3: "권한" },
    /* 보안 > 인증서 */
    { code: "CHK-CERT-001", nm: "인증서 만료 확인", method: "자동", std: "> 30일", unit: "일", cat1: "보안", cat2: "인증서", cat3: "만료" },
    { code: "CHK-CERT-002", nm: "SSL 인증서 유효성", method: "자동", std: "유효", unit: "", cat1: "보안", cat2: "인증서", cat3: "SSL" },
    /* 네트워크 > 인터페이스 */
    { code: "CHK-NET-001", nm: "네트워크 인터페이스 상태", method: "자동", std: "UP", unit: "", cat1: "네트워크", cat2: "인터페이스", cat3: "상태" },
    { code: "CHK-NET-002", nm: "네트워크 트래픽 사용률", method: "자동", std: "< 80%", unit: "%", cat1: "네트워크", cat2: "인터페이스", cat3: "트래픽" },
    { code: "CHK-NET-008", nm: "대역폭 가용률", method: "자동", std: "> 20%", unit: "%", cat1: "네트워크", cat2: "인터페이스", cat3: "대역폭" },
    /* 네트워크 > 품질 */
    { code: "CHK-NET-003", nm: "패킷 손실률", method: "자동", std: "< 1%", unit: "%", cat1: "네트워크", cat2: "품질", cat3: "패킷손실" },
    { code: "CHK-NET-004", nm: "네트워크 지연시간", method: "자동", std: "< 100ms", unit: "ms", cat1: "네트워크", cat2: "품질", cat3: "지연시간" },
    /* 네트워크 > 설정 */
    { code: "CHK-NET-005", nm: "ARP 테이블 정상 확인", method: "자동", std: "정상", unit: "", cat1: "네트워크", cat2: "설정", cat3: "ARP" },
    { code: "CHK-NET-006", nm: "라우팅 테이블 확인", method: "자동", std: "정상", unit: "", cat1: "네트워크", cat2: "설정", cat3: "라우팅" },
    { code: "CHK-NET-007", nm: "VLAN 설정 확인", method: "육안", std: "정상", unit: "", cat1: "네트워크", cat2: "설정", cat3: "VLAN" },
    /* WEB > 응답 */
    { code: "CHK-WEB-001", nm: "WEB 서비스 응답 코드", method: "자동", std: "200", unit: "", cat1: "WEB", cat2: "응답", cat3: "응답코드" },
    { code: "CHK-WEB-002", nm: "WEB 응답 시간", method: "자동", std: "< 3초", unit: "초", cat1: "WEB", cat2: "응답", cat3: "응답시간" },
    { code: "CHK-WEB-008", nm: "정적 리소스 응답 확인", method: "자동", std: "정상", unit: "", cat1: "WEB", cat2: "응답", cat3: "정적리소스" },
    /* WEB > 프로세스 */
    { code: "CHK-WEB-004", nm: "WEB 프로세스 상태", method: "자동", std: "Running", unit: "", cat1: "WEB", cat2: "프로세스", cat3: "상태" },
    { code: "CHK-WEB-005", nm: "WEB 커넥션 수", method: "자동", std: "< 1000", unit: "개", cat1: "WEB", cat2: "프로세스", cat3: "커넥션" },
    { code: "CHK-WEB-006", nm: "WEB 쓰레드 풀 사용률", method: "자동", std: "< 80%", unit: "%", cat1: "WEB", cat2: "프로세스", cat3: "쓰레드" },
    /* WEB > 로그 */
    { code: "CHK-WEB-003", nm: "WEB 에러 로그 확인", method: "육안", std: "0건", unit: "건", cat1: "WEB", cat2: "로그", cat3: "에러" },
    { code: "CHK-WEB-007", nm: "WEB 접근 로그 확인", method: "육안", std: "정상", unit: "", cat1: "WEB", cat2: "로그", cat3: "접근" },
    /* WAS > 리소스 */
    { code: "CHK-WAS-001", nm: "WAS 프로세스 상태", method: "자동", std: "Running", unit: "", cat1: "WAS", cat2: "리소스", cat3: "프로세스" },
    { code: "CHK-WAS-002", nm: "WAS 힙 메모리 사용률", method: "자동", std: "< 80%", unit: "%", cat1: "WAS", cat2: "리소스", cat3: "힙메모리" },
    { code: "CHK-WAS-003", nm: "WAS 쓰레드 풀 사용률", method: "자동", std: "< 80%", unit: "%", cat1: "WAS", cat2: "리소스", cat3: "쓰레드" },
    { code: "CHK-WAS-007", nm: "WAS GC 빈도 확인", method: "자동", std: "정상", unit: "", cat1: "WAS", cat2: "리소스", cat3: "GC" },
    /* WAS > 커넥션 */
    { code: "CHK-WAS-004", nm: "WAS JDBC 커넥션 풀", method: "자동", std: "< 80%", unit: "%", cat1: "WAS", cat2: "커넥션", cat3: "JDBC" },
    { code: "CHK-WAS-005", nm: "WAS 세션 수", method: "자동", std: "< 5000", unit: "개", cat1: "WAS", cat2: "커넥션", cat3: "세션" },
    /* WAS > 로그/배포 */
    { code: "CHK-WAS-006", nm: "WAS 에러 로그 확인", method: "육안", std: "0건", unit: "건", cat1: "WAS", cat2: "로그/배포", cat3: "에러" },
    { code: "CHK-WAS-008", nm: "WAS 배포 상태 확인", method: "육안", std: "정상", unit: "", cat1: "WAS", cat2: "로그/배포", cat3: "배포" },
    /* DBMS > 상태 */
    { code: "CHK-DB-001", nm: "DB 서비스 상태", method: "자동", std: "Running", unit: "", cat1: "DBMS", cat2: "상태", cat3: "서비스" },
    { code: "CHK-DB-002", nm: "DB 커넥션 수", method: "자동", std: "< 200", unit: "개", cat1: "DBMS", cat2: "상태", cat3: "커넥션" },
    { code: "CHK-DB-007", nm: "DB 복제 상태", method: "자동", std: "정상", unit: "", cat1: "DBMS", cat2: "상태", cat3: "복제" },
    /* DBMS > 저장소 */
    { code: "CHK-DB-003", nm: "DB 테이블스페이스 사용률", method: "자동", std: "< 85%", unit: "%", cat1: "DBMS", cat2: "저장소", cat3: "테이블스페이스" },
    { code: "CHK-DB-009", nm: "DB 아카이브 로그 확인", method: "자동", std: "< 80%", unit: "%", cat1: "DBMS", cat2: "저장소", cat3: "아카이브" },
    /* DBMS > 성능 */
    { code: "CHK-DB-004", nm: "DB 슬로우 쿼리 수", method: "자동", std: "< 10", unit: "건", cat1: "DBMS", cat2: "성능", cat3: "슬로우쿼리" },
    { code: "CHK-DB-005", nm: "DB 데드락 발생 수", method: "자동", std: "0", unit: "건", cat1: "DBMS", cat2: "성능", cat3: "데드락" },
    { code: "CHK-DB-008", nm: "DB Lock 대기 확인", method: "자동", std: "0", unit: "건", cat1: "DBMS", cat2: "성능", cat3: "Lock" },
    { code: "CHK-DB-010", nm: "DB 인덱스 상태 확인", method: "육안", std: "정상", unit: "", cat1: "DBMS", cat2: "성능", cat3: "인덱스" },
    /* DBMS > 로그 */
    { code: "CHK-DB-006", nm: "DB 에러 로그 확인", method: "육안", std: "0건", unit: "건", cat1: "DBMS", cat2: "로그", cat3: "에러" },
    /* 운영 > 백업 */
    { code: "CHK-BAK-001", nm: "백업 상태 확인", method: "육안", std: "정상", unit: "", cat1: "운영", cat2: "백업", cat3: "상태" },
    { code: "CHK-BAK-002", nm: "전체 백업 수행 확인", method: "자동", std: "성공", unit: "", cat1: "운영", cat2: "백업", cat3: "전체" },
    { code: "CHK-BAK-003", nm: "증분 백업 수행 확인", method: "자동", std: "성공", unit: "", cat1: "운영", cat2: "백업", cat3: "증분" },
    { code: "CHK-BAK-004", nm: "백업 용량 확인", method: "자동", std: "< 500GB", unit: "GB", cat1: "운영", cat2: "백업", cat3: "용량" },
    { code: "CHK-BAK-005", nm: "백업 복원 테스트", method: "육안", std: "성공", unit: "", cat1: "운영", cat2: "백업", cat3: "복원" },
    /* 운영 > 이중화 */
    { code: "CHK-HA-001", nm: "이중화 상태 확인", method: "자동", std: "Active", unit: "", cat1: "운영", cat2: "이중화", cat3: "상태" },
    { code: "CHK-HA-002", nm: "이중화 절체 테스트", method: "육안", std: "성공", unit: "", cat1: "운영", cat2: "이중화", cat3: "절체" },
    { code: "CHK-HA-003", nm: "클러스터 노드 상태", method: "자동", std: "정상", unit: "", cat1: "운영", cat2: "이중화", cat3: "클러스터" },
    { code: "CHK-HA-004", nm: "Heartbeat 확인", method: "자동", std: "정상", unit: "", cat1: "운영", cat2: "이중화", cat3: "Heartbeat" },
    /* 운영 > 성능 */
    { code: "CHK-PERF-001", nm: "TPS 처리량 확인", method: "자동", std: "> 100", unit: "TPS", cat1: "운영", cat2: "성능", cat3: "TPS" },
    { code: "CHK-PERF-002", nm: "평균 응답시간", method: "자동", std: "< 2초", unit: "초", cat1: "운영", cat2: "성능", cat3: "응답시간" },
    { code: "CHK-PERF-003", nm: "동시접속자 처리 확인", method: "자동", std: "> 500", unit: "명", cat1: "운영", cat2: "성능", cat3: "동시접속" },
    { code: "CHK-PERF-004", nm: "부하테스트 결과 확인", method: "육안", std: "통과", unit: "", cat1: "운영", cat2: "성능", cat3: "부하테스트" },
    /* 하드웨어 > 전원 */
    { code: "CHK-HW-005", nm: "UPS 상태 확인", method: "자동", std: "정상", unit: "", cat1: "하드웨어", cat2: "전원", cat3: "UPS" },
    { code: "CHK-HW-001", nm: "하드웨어 온도 확인", method: "자동", std: "< 70℃", unit: "℃", cat1: "하드웨어", cat2: "냉각", cat3: "온도" },
    { code: "CHK-HW-003", nm: "팬 상태 확인", method: "자동", std: "정상", unit: "", cat1: "하드웨어", cat2: "냉각", cat3: "팬" },
    { code: "CHK-HW-004", nm: "RAID 상태 확인", method: "자동", std: "정상", unit: "", cat1: "하드웨어", cat2: "스토리지", cat3: "RAID" },
    { code: "CHK-HW-006", nm: "디스크 SMART 상태", method: "자동", std: "정상", unit: "", cat1: "하드웨어", cat2: "스토리지", cat3: "SMART" },
  ];

  const defaultItems = [
    { id: 1, code: "CHK-CPU-001", nm: "CPU 사용률", method: "자동", std: "< 80%", unit: "%" },
    { id: 2, code: "CHK-MEM-001", nm: "메모리 사용률", method: "자동", std: "< 85%", unit: "%" },
    { id: 3, code: "CHK-DISK-001", nm: "디스크 사용률", method: "자동", std: "< 90%", unit: "%" },
    { id: 4, code: "CHK-LOG-001", nm: "로그 에러 확인", method: "육안", std: "0건", unit: "건" },
  ];
  const [inspItems, setInspItems] = useState(defaultItems);
  const [nextId, setNextId] = useState(5);

  useEffect(() => {
    if (open) { setInspItems(defaultItems); setNextId(5); }
  }, [open]);

  const addItem = (code) => {
    const vc = vcPool.find(v => v.code === code);
    if (!vc) return;
    setInspItems(prev => [...prev, { id: nextId, code: vc.code, nm: vc.nm, method: vc.method, std: vc.std, unit: vc.unit }]);
    setNextId(p => p + 1);
  };
  const removeItem = (id) => setInspItems(prev => prev.filter(x => x.id !== id));
  const updateItemStd = (id, val) => setInspItems(prev => prev.map(x => x.id === id ? { ...x, std: val } : x));


  const available = vcPool.filter(vc => !inspItems.some(it => it.code === vc.code) && (!form.inspKind || vc.cat1 === form.inspKind));

  /* ── 미리보기 탭 state ── */
  const [showPreview, setShowPreview] = useState(false);

  /* 패널 열릴 때 추가 화면이면 미리보기 기본 활성화 */
  useEffect(() => { if (open) setShowPreview(!item); }, [open, item]);

  /* ── 점검항목을 대분류별로 그룹화 ── */
  const groupedItems = inspItems.reduce((acc, it) => {
    const vc = vcPool.find(v => v.code === it.code);
    const cat = vc ? vc.cat1 : "기타";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push({ ...it, cat2: vc ? vc.cat2 : "", cat3: vc ? vc.cat3 : "" });
    return acc;
  }, {});

  /* ── 점검표 미리보기 컴포넌트 ── */
  const PreviewDoc = () => {
    const today = new Date();
    const tdStr = `${today.getFullYear()}년 ${today.getMonth()+1}월 ${today.getDate()}일`;
    const tbl = { width: "100%", borderCollapse: "collapse" };
    const th = (extra={}) => ({ padding: "6px 10px", border: "1px solid #333", background: "#1a3a5c", color: "#fff", fontSize: 11, fontWeight: 700, textAlign: "center", ...extra });
    const thLight = (extra={}) => ({ padding: "6px 10px", border: "1px solid #333", background: "#c8d8e8", color: "#1a3a5c", fontSize: 11, fontWeight: 700, textAlign: "center", ...extra });
    const td = (extra={}) => ({ padding: "6px 10px", border: "1px solid #aaa", fontSize: 11, verticalAlign: "middle", ...extra });
    const secHdr = (extra={}) => ({ padding: "5px 10px", border: "1px solid #333", background: "#2d5a8e", color: "#fff", fontSize: 11, fontWeight: 700, textAlign: "center", letterSpacing: 2, ...extra });
    return (
      <div style={{ fontFamily: "'Malgun Gothic', 'Apple SD Gothic Neo', sans-serif", background: "#fff", padding: "20px 24px", minHeight: "100%", color: "#111" }}>
        {/* 제목 */}
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: 12, color: "#1a3a5c", borderBottom: "3px solid #1a3a5c", paddingBottom: 8, marginBottom: 4 }}>점 검 표</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "center", fontSize: 12, color: "#444" }}>
            <span style={{ width: 12, height: 12, border: "1.5px solid #333", display: "inline-block", verticalAlign: "middle" }} />
            <span>{form.nm || "(점검표 명 미입력)"} — {form.inspType} / {form.inspKind || "점검종류 미선택"}</span>
          </div>
        </div>

        {/* SITE INFORMATION */}
        <div style={secHdr({ marginBottom: 0 })}>SITE INFORMATION</div>
        <table style={{ ...tbl, marginBottom: 10 }}>
          <tbody>
            <tr>
              <td style={thLight({ width: "15%", textAlign: "left" })}>고객사명</td>
              <td style={td({ width: "35%" })}>&nbsp;</td>
              <td style={thLight({ width: "15%", textAlign: "left" })}>작업일자</td>
              <td style={td({ width: "35%" })}>{tdStr}</td>
            </tr>
            <tr>
              <td style={thLight({ textAlign: "left" })}>작업구분</td>
              <td style={td()}>주간 / 야간 &nbsp;&nbsp; 평일 / 휴일</td>
              <td style={thLight({ textAlign: "left" })}>작업시간</td>
              <td style={td()}>:&nbsp;&nbsp;&nbsp;&nbsp;~&nbsp;&nbsp;&nbsp;&nbsp;:</td>
            </tr>
          </tbody>
        </table>

        {/* SYSTEM INFORMATION */}
        <div style={secHdr({ marginBottom: 0 })}>SYSTEM INFORMATION</div>
        <table style={{ ...tbl, marginBottom: 10 }}>
          <tbody>
            {form.exposedRes.length > 0 ? form.exposedRes.map((r, i) => (
              <tr key={r}>
                <td style={thLight({ width: "20%", textAlign: "left" })}>{r}</td>
                <td style={td()}>&nbsp;</td>
                {form.exposedRes[i+1] ? <>
                  <td style={thLight({ width: "20%", textAlign: "left" })}>{form.exposedRes[i+1]}</td>
                  <td style={td()}>&nbsp;</td>
                </> : <><td style={{ border: "1px solid #aaa" }} /><td style={{ border: "1px solid #aaa" }} /></>}
              </tr>
            )).filter((_, i) => i % 2 === 0) : (
              <tr>
                <td colSpan={4} style={td({ textAlign: "center", color: "#aaa" })}>노출 자원정보를 선택하면 여기에 표시됩니다</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* SYSTEM DETAIL CHECK */}
        <div style={secHdr({ marginBottom: 0 })}>SYSTEM DETAIL CHECK</div>
        {Object.keys(groupedItems).length === 0 ? (
          <div style={{ padding: 20, textAlign: "center", color: "#aaa", fontSize: 12, border: "1px solid #aaa" }}>점검항목을 추가하면 여기에 표시됩니다</div>
        ) : (
          Object.entries(groupedItems).map(([cat, items]) => (
            <div key={cat}>
              <table style={{ ...tbl }}>
                <thead>
                  <tr>
                    <th style={th({ width: "70%" })}>점검 내용</th>
                    <th style={th({ width: "30%", borderLeft: "2px solid #fff" })}>점검 결과</th>
                  </tr>
                  <tr>
                    <td colSpan={2} style={{ padding: "4px 10px", border: "1px solid #aaa", background: "#e8f0f8", color: "#1a3a5c", fontSize: 11, fontWeight: 700 }}>
                      [{cat}]
                    </td>
                  </tr>
                </thead>
                <tbody>
                  {items.map(it => (
                    <tr key={it.id}>
                      <td style={td()}>
                        <div style={{ fontWeight: 600, fontSize: 11 }}>{it.nm}</div>
                        <div style={{ fontSize: 9, color: "#888", marginTop: 1 }}>{it.code}</div>
                      </td>
                      <td style={td({ textAlign: "center" })}>
                        {it.method === "자동"
                          ? <span style={{ fontSize: 11, color: "#aaa" }}>자동 수집</span>
                          : <span style={{ fontSize: 11 }}>□ 정상 &nbsp; □ 비정상</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}

        {/* 특이사항 */}
        <div style={{ marginTop: 10, border: "1px solid #aaa" }}>
          <div style={{ padding: "5px 10px", background: "#e8f0f8", borderBottom: "1px solid #aaa", fontSize: 11, fontWeight: 700, color: "#1a3a5c" }}>[특이사항]</div>
          <div style={{ padding: "40px 10px 10px", fontSize: 11, color: "#aaa", fontStyle: "italic" }}>
            {form.memo || "점검 중 특이사항을 기재합니다."}
          </div>
        </div>

        {/* 확인 서명 */}
        <div style={{ marginTop: 16, border: "2px solid #1a3a5c", borderRadius: 4 }}>
          <div style={{ padding: "6px 0", background: "#1a3a5c", color: "#fff", textAlign: "center", fontSize: 11, fontWeight: 700, letterSpacing: 4 }}>상기와 같이 점검 하였음을 확인 합니다</div>
          <table style={{ ...tbl }}>
            <tbody>
              <tr>
                <td style={td({ width: "15%", background: "#f5f5f5", fontWeight: 700 })}>작업자</td>
                <td style={td({ width: "35%" })}>&nbsp;</td>
                <td style={td({ width: "15%", background: "#f5f5f5", fontWeight: 700 })}>확인자</td>
                <td style={td({ width: "35%" })}>&nbsp;</td>
              </tr>
              <tr>
                <td style={td({ background: "#f5f5f5", fontWeight: 700 })}>소속/성명</td>
                <td style={td()}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                <td style={td({ background: "#f5f5f5", fontWeight: 700 })}>부서/성명</td>
                <td style={td()}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style={{ fontSize: 11, color: "#aaa" }}>(인)</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  /* 점검세부분류 목록 (vcPool의 cat1 기반) */
  const subCategories = Array.from(new Set(vcPool.map(v => v.cat1)));

  /* ── 편집 폼 ── */
  const editFormJSX = (
    <>
      <div style={{ marginBottom: 18 }}>
        <SecTitle label="기본 정보" primary />
        <FormRow label="점검표 명" required>
          <input style={{ ...fInput, ...roS }} value={form.nm} onChange={e => set("nm", e.target.value)} placeholder="점검표 명" readOnly={ro} maxLength={100} />
        </FormRow>
        <FormRow label="점검세부분류" required>
          <RoSelect readOnly={ro} style={{ ...fSelect, ...roSel }} value={form.inspKind} onChange={e => {
            const nv = e.target.value;
            if (form.inspKind && nv !== form.inspKind && inspItems.length > 0) {
              setKindChangeConfirm(nv);
            } else {
              set("inspKind", nv); setItemFilter("");
            }
          }}>
            <option value="">선택하세요</option>
            {subCategories.map(o => <option key={o} value={o}>{o}</option>)}
          </RoSelect>
        </FormRow>
        <FormRow label="노출 자원정보">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {resInfoOptions.map(ri => {
              const sel = form.exposedRes.includes(ri);
              return <span key={ri} onClick={() => !ro && set("exposedRes", sel ? form.exposedRes.filter(x => x !== ri) : [...form.exposedRes, ri])} style={{ padding: "3px 10px", borderRadius: 12, fontSize: 11, border: `1px solid ${sel ? C.pri : C.brd}`, background: sel ? C.priL : "", color: sel ? C.priD : C.txS, cursor: ro ? "default" : "pointer" }}>{ri}</span>;
            })}
          </div>
        </FormRow>
        {ro && <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="연결된 정기점검" half>
            <input style={{ ...fInput, ...roS }} value={form.linkedSch} readOnly />
          </FormRow>
          <FormRow label="연결된 자원" half>
            <input style={{ ...fInput, ...roS }} value={form.linkedRes} readOnly />
          </FormRow>
        </div>}
      </div>

      <div style={{ marginBottom: 18 }}>
        <SecTitle label="점검항목" />
        {!form.inspKind && <div style={{ padding: 16, textAlign: "center", color: C.txL, fontSize: 12, background: "#F9FAFC", borderRadius: 6, marginBottom: 8 }}>점검세부분류를 먼저 선택하세요.</div>}
        {form.inspKind && <><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12, marginBottom: 8 }}>
          <thead><tr style={{ background: "#F9FAFC" }}>
            {["항목명","검증코드","방식","기준값","단위",...(ro ? [] : [""])].map(h => <th key={h} style={{ padding: "8px 6px", borderBottom: `2px solid ${C.brd}`, textAlign: "left", fontWeight: 600, color: C.txS }}>{h}</th>)}
          </tr></thead>
          <tbody>{inspItems.map(it => <tr key={it.id} style={{ borderBottom: `1px solid ${C.brd}` }}>
            <td style={{ padding: "8px 6px" }}>{it.nm}</td>
            <td style={{ fontSize: 11, color: C.pri }}>{it.code}</td>
            <td><span style={{ padding: "1px 6px", borderRadius: 3, fontSize: 10, background: it.method === "자동" ? "#dbeafe" : "#fff7ed", color: it.method === "자동" ? "#1e40af" : "#c2410c" }}>{it.method}</span></td>
            <td>{ro ? <span style={{ color: C.txS }}>{it.std}</span> : <input style={{ width: 80, padding: "3px 6px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 12 }} value={it.std} onChange={e => updateItemStd(it.id, e.target.value)} />}</td>
            <td style={{ color: C.txS }}>{it.unit}</td>
            {!ro && <td style={{ textAlign: "center" }}><span onClick={() => removeItem(it.id)} style={{ cursor: "pointer", color: C.red, fontSize: 14, fontWeight: 600 }} title="삭제">×</span></td>}
          </tr>)}</tbody>
        </table>
        {inspItems.length === 0 && <div style={{ padding: 16, textAlign: "center", color: C.txL, fontSize: 12, background: "#F9FAFC", borderRadius: 6 }}>점검항목이 없습니다. 아래에서 추가하세요.</div>}</>}
        {!ro && form.inspKind && available.length > 0 && (() => {
          const filtered = itemFilter ? available.filter(vc => vc.nm.toLowerCase().includes(itemFilter.toLowerCase()) || vc.code.toLowerCase().includes(itemFilter.toLowerCase())) : available;
          return <div style={{ marginTop: 10 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: C.txS }}>추가 가능한 항목 <span style={{ fontWeight: 400, color: C.txL }}>({filtered.length}/{available.length}개)</span></div>
            </div>
            <div style={{ position: "relative", marginBottom: 6 }}>
              <input style={{ ...fInput, paddingLeft: 28, fontSize: 12, height: 32 }} placeholder="항목명 또는 검증코드로 필터링..." value={itemFilter} onChange={e => setItemFilter(e.target.value)} />
              <span style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}><Ic n="search" s={13} c={C.txL} /></span>
              {itemFilter && <span onClick={() => setItemFilter("")} style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", cursor: "pointer", fontSize: 14, color: C.txL, lineHeight: 1 }}>×</span>}
            </div>
            <div style={{ border: `1px solid ${C.brd}`, borderRadius: 8, maxHeight: 240, overflowY: "auto" }}>
              {filtered.length === 0 && <div style={{ padding: 14, textAlign: "center", fontSize: 12, color: C.txL }}>"{itemFilter}" 검색 결과가 없습니다.</div>}
              {filtered.map(vc => (
                <div key={vc.code} onClick={() => addItem(vc.code)} style={{ padding: "7px 12px", cursor: "pointer", borderBottom: `1px solid ${C.brd}`, display: "flex", alignItems: "center", gap: 6, fontSize: 12 }} onMouseEnter={e => e.currentTarget.style.background = "#f0fdf4"} onMouseLeave={e => e.currentTarget.style.background = ""}>
                  <span style={{ padding: "1px 6px", borderRadius: 3, fontSize: 10, background: vc.method === "자동" ? "#dbeafe" : "#fff7ed", color: vc.method === "자동" ? "#1e40af" : "#c2410c", flexShrink: 0 }}>{vc.method}</span>
                  <span style={{ fontWeight: 500, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{vc.nm}</span>
                  <span style={{ fontSize: 10, color: C.txL, flexShrink: 0 }}>{vc.code}</span>
                  <span style={{ fontSize: 9, color: C.txS, background: "#F9FAFC", padding: "1px 5px", borderRadius: 8, flexShrink: 0 }}>{vc.cat2}›{vc.cat3}</span>
                </div>
              ))}
            </div>
          </div>;
        })()}
        {!ro && form.inspKind && available.length === 0 && inspItems.length > 0 && <div style={{ marginTop: 10, padding: 12, textAlign: "center", color: C.txL, fontSize: 11, background: "#F9FAFC", borderRadius: 6 }}>모든 항목이 추가되었습니다.</div>}
      </div>

      <div style={{ marginBottom: 18 }}>
        <SecTitle label="기타" />
        <FormRow label="점검 목적">
          <textarea style={{ ...fTextarea, ...(ro ? { ...roS, resize: "none" } : {}) }} value={form.purpose} onChange={e => set("purpose", e.target.value)} placeholder="점검표 사용 목적" readOnly={ro} maxLength={500} />
        </FormRow>
        <FormRow label="비고">
          <textarea style={{ ...fTextarea, ...(ro ? { ...roS, resize: "none" } : {}) }} value={form.memo} onChange={e => set("memo", e.target.value)} placeholder="특이사항" readOnly={ro} maxLength={500} />
        </FormRow>
      </div>

      <div style={{ marginBottom: 18 }}>
        <SecTitle label="관리 정보" />
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="상태" half>
            <RoSelect readOnly={ro} style={{ ...fSelect, ...roSel }} value={form.st} onChange={e => set("st", e.target.value)}>
              <option value="Y">사용</option><option value="N">미사용</option>
            </RoSelect>
          </FormRow>
          <FormRow label="점검표 ID" half>
            <input style={{ ...fInput, background: "#F9FAFC", pointerEvents: "none" }} value={form.clId} readOnly />
          </FormRow>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <FormRow label="등록자" half>
            <input style={{ ...fInput, background: "#F9FAFC", pointerEvents: "none" }} value={form.registrant} readOnly />
          </FormRow>
          <FormRow label="등록일" half>
            <input style={{ ...fInput, background: "#F9FAFC", pointerEvents: "none" }} value={form.regDt} readOnly />
          </FormRow>
        </div>
      </div>
    </>
  );

  return (
    <>
    <UnsavedConfirm open={confirmOpen} onDiscard={handleDiscard} onSave={() => handleSaveConfirm()} />
    {/* 점검세부분류 변경 확인 */}
    {kindChangeConfirm && (
      <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,.35)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setKindChangeConfirm(null)}>
        <div style={{ background: "#fff", borderRadius: 10, padding: "24px 28px", width: 380, animation: "modalIn .2s ease" }} onClick={e => e.stopPropagation()}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.txH, marginBottom: 12 }}>점검세부분류 변경</div>
          <div style={{ fontSize: 13, color: C.txS, lineHeight: 1.6, marginBottom: 20 }}>다른 점검 세부분류를 선택하시는 경우 모든 점검항목이 초기화 됩니다.</div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
            <Btn onClick={() => setKindChangeConfirm(null)}>취소</Btn>
            <Btn primary onClick={() => { set("inspKind", kindChangeConfirm); setInspItems([]); setNextId(1); setItemFilter(""); setKindChangeConfirm(null); }}>확인</Btn>
          </div>
        </div>
      </div>
    )}
    <SidePanel open={open} onClose={() => { setShowPreview(false); if (editMode) { setConfirmOpen(true); } else { onClose(); } }} title={isNew ? "점검표 추가" : "점검표 상세"} width={showPreview ? 1220 : 640}>
      {/* 2컬럼 flex - 미리보기(왼쪽) + 편집폼(오른쪽) */}
      <div style={{ display: "flex", margin: "-20px -24px", height: "calc(100vh - 64px)" }}>

        {/* 미리보기 컬럼 - 왼쪽, SidePanel 내부에 속함 */}
        {showPreview && (
          <div style={{ flex: "0 0 556px", borderRight: `1px solid ${C.brd}`, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ padding: "14px 20px 12px", borderBottom: `1px solid ${C.brd}`, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, background: "#FAFBFC" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: C.txH }}>점검표 미리보기</span>
              <span style={{ fontSize: 10, color: C.txL, background: "#F0F5FF", padding: "2px 8px", borderRadius: 10, border: `1px solid ${C.priL}` }}>실시간 반영</span>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
              <div style={{ border: `1px solid ${C.brd}`, borderRadius: 6, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
                <PreviewDoc />
              </div>
            </div>
          </div>
        )}

        {/* 편집 폼 컬럼 - 오른쪽 */}
        <div style={{ flex: "0 0 640px", display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>
            {/* 상단 액션 버튼 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, marginTop: -6 }}>
              <button
                onClick={() => setShowPreview(p => !p)}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", fontSize: 12, fontWeight: 600, border: `1px solid ${showPreview ? C.pri : C.brd}`, borderRadius: 6, background: showPreview ? C.priL : "#fff", color: showPreview ? C.pri : C.txS, cursor: "pointer", transition: "all .3s" }}>
                {showPreview
                  ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="0.5" y="0.5" width="9" height="9" rx="1.5"/><path d="M8 6l5-5M13 5V1h-4"/></svg>
                  : <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><rect x="4.5" y="4.5" width="9" height="9" rx="1.5"/><path d="M6 8L1 13M1 9v4h4"/></svg>}
                {showPreview ? "미리보기 닫기" : "점검표 미리보기"}
              </button>
              <div style={{ display: "flex", gap: 6 }}>
                {!isNew && <button onClick={() => {}} style={{ padding: "5px 14px", fontSize: 12, fontWeight: 600, border: "1px solid #fca5a5", borderRadius: 6, background: "#fef2f2", color: "#ef4444", cursor: "pointer" }}>삭제</button>}
                {!isNew && ro && <button onClick={() => setEditMode(true)} style={{ padding: "5px 14px", fontSize: 12, fontWeight: 600, border: `1px solid ${C.pri}`, borderRadius: 6, background: C.priL, color: C.pri, cursor: "pointer" }}>수정</button>}
              </div>
            </div>
            {editFormJSX}
            {(isNew || editMode) && <PanelFooter onCancel={handleCancel} onSave={handleSave} saveLabel={isNew ? "등록" : "저장"} />}
            {ro && <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 16, borderTop: `1px solid ${C.brd}` }}><Btn onClick={onClose}>닫기</Btn></div>}
          </div>
        </div>

      </div>
    </SidePanel>
    </>
  );
};

const MgrCL = () => {
  const [selItem, setSelItem] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  return <div>
  <PH title="점검표" bc="홈 > 환경설정 > 점검표" />
  <SB ph="점검표명으로 검색" />
  <Tbl secTitle="점검표 목록" secCount={CL.length} secButtons={<SecBtnP onClick={() => setShowAdd(true)}>+ 점검표 추가</SecBtnP>} cols={[
    { t: "상태", k: "useYn", w: 100, r: v => <YnBadge v={v} /> },
    { t: "점검표명", k: "nm", mw: 150, align: "left", r: (v, row) => <span style={{ fontWeight: 600, color: C.pri, cursor: "pointer" }} onClick={() => setSelItem(row)}>{v}</span> },
    { t: "상세구분", k: "sub" },
    { t: "항목수", k: "items" }, { t: "스케줄", k: "sch" },
    { t: "점검표 ID", k: "id" },
  ]} data={CL} />
  <ChecklistPanel open={showAdd} onClose={() => setShowAdd(false)} item={null} />
  <ChecklistPanel open={!!selItem} onClose={() => setSelItem(null)} item={selItem} />
</div>};

const MgrVC = () => <div>
  <PH title="검증코드" bc="홈 > 환경설정 > 점검표 > 검증코드" />
  <SB ph="검증코드명으로 검색" />
  <Tbl secTitle="검증코드 목록" secCount={VC.length} cols={[
    { t: "상태", k: "useYn", w: 100, r: v => <YnBadge v={v} /> },
    { t: "코드", k: "id", mw: 150, align: "left" }, { t: "검증코드명", k: "nm", mw: 200, align: "left", r: v => <span style={{ fontWeight: 600 }}>{v}</span> },
    { t: "에이전트 타입", k: "agent", r: v => <span style={{ padding: "2px 8px", borderRadius: 4, fontSize: 11, background: v === "PROMETHEUS" ? "#dcfce7" : v === "SSH" ? "#dbeafe" : v === "LOKI" ? "#fff7ed" : "#F9FAFC" }}>{v}</span> },
    { t: "정상 기준값", k: "val" },
  ]} data={VC} />
</div>;

const Placeholder = ({ title, bc }) => <div>
  <PH title={title} bc={bc} />
  <Card><div style={{ padding: 36, textAlign: "center", color: C.txL }}><Ic n="gear" s={40} c={C.txL} /><div style={{ marginTop: 10, fontSize: 14 }}>{title}</div><div style={{ marginTop: 4, fontSize: 12 }}>이 페이지는 개발 중입니다.</div></div></Card>
</div>;

/* ──── PAGES: SENTINEL ──── */
const StlDash = () => {
  const cnt = { s: DI.filter(x => x.st === "예정").length, p: DI.filter(x => x.st === "진행").length, d: DI.filter(x => x.st === "지연").length, c: DI.filter(x => x.st === "완료").length };
  return <div>
    <PH title="대시보드" bc="홈 > 대시보드" />
    <div style={{ display: "flex", gap: 14, marginBottom: 18, flexWrap: "wrap" }}>
      <Stat label="오늘 점검" value={cnt.s + cnt.p} color={C.sec} icon="cal" />
      <Stat label="진행 중" value={cnt.p} color={C.pri} icon="check" />
      <Stat label="지연" value={cnt.d} color={C.red} icon="alert" />
      <Stat label="완료" value={cnt.c} color={C.purp} icon="check" />
    </div>
    <Tbl secTitle="나의 점검 현황" secCount={DI.length} cols={[{ t: "자원", k: "resNm" }, { t: "점검표", k: "clNm" }, { t: "예정일", k: "due" }, { t: "상태", k: "st", r: v => <Badge status={v} /> }]} data={DI} />
  </div>;
};

const StlDaily = () => {
  const [selItem, setSelItem] = useState(null);
  const [fKind, setFKind] = useState(null);
  const [fSub, setFSub] = useState(null);
  const filtered = DI.filter(x => {
    if (!fKind) return true;
    if (x.kind !== fKind) return false;
    if (fSub && x.mid !== fSub) return false;
    return true;
  });
  const title = fSub ? `${fKind} > ${fSub}` : fKind || "전체현황";
  return <div>
    <PH title="일상점검" bc="홈 > 일상점검" />
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 14 }}>
      <Card title="점검종류" style={{ position: "sticky", top: 20, maxHeight: "calc(100vh - 170px)", overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <InspFilter menus={_dailyMenu} sel={fKind} sub={fSub} onSelect={(k, s) => { setFKind(k); setFSub(s); }} data={DI} />
      </Card>
      <div style={{ minWidth: 0 }}>
        <SB ph="자원명, 점검자로 검색" />
        <Tbl secTitle={title} secCount={filtered.length} cols={[
          { t: "상태", k: "st", w: 80, r: v => <Badge status={v} /> },
          { t: "정보시스템", k: "sysNm", mw: 130, align: "left" },
          { t: "자원명", k: "resNm", mw: 140, align: "left", r: (v, row) => <span onClick={e => { e.stopPropagation(); setSelItem(row); }} style={{ fontWeight: 600, color: C.pri, cursor: "pointer" }}>{v}</span> },
          { t: "자원유형", k: "mid", w: 90 },
          { t: "점검자", k: "insp", w: 80 },
          { t: "점검표", k: "clNm", mw: 140, align: "left" },
          { t: "수행일시", k: "execDt" },
          { t: "자동점검결과", k: "autoRes", r: (v, row) => (
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ color: v === "-" ? C.txL : v === "정상" ? "#479559" : v === "비정상" ? "#dc2626" : "#ea580c", fontWeight: v === "-" ? 400 : 600 }}>{v}</span>
              {v !== "-" && (
                <button
                  onClick={e => { e.stopPropagation(); }}
                  style={{ padding: "1px 7px", fontSize: 10, fontWeight: 600, borderRadius: 3, border: `1px solid ${C.brd}`, background: "#fff", color: C.txS, cursor: "pointer", whiteSpace: "nowrap" }}>
                  재점검 수행
                </button>
              )}
            </div>
          )},
          { t: "육안점검결과", k: "eyeRes", r: v => v === "-" ? <span style={{color:C.txL}}>-</span> : <span style={{color: v==="정상"?"#479559":v==="비정상"?"#dc2626":"#ea580c", fontWeight:600}}>{v}</span> },
          { t: "제출일시", k: "submitDt" },
          { t: "재점검여부", k: "recheck", r: v => v === "Y" ? <span style={{color:"#dc2626",fontWeight:600}}>Y</span> : <span style={{color:C.txL}}>N</span> },
          { t: "", k: "id", w: 90, r: (_, row) => row.st !== "완료"
            ? <Btn primary small onClick={e => { e.stopPropagation(); setSelItem(row); }}>점검수행</Btn>
            : <span style={{ fontSize: 11, color: C.txL }}>완료</span> },
        ]} data={filtered} />
      </div>
    </div>
    <DailyReportPanel open={!!selItem} onClose={() => setSelItem(null)} item={selItem} canReport />
  </div>;
};

const StlSpecial = () => {
  const [selItem, setSelItem] = useState(null);
  const [fKind, setFKind] = useState(null);
  const filtered = fKind ? SI.filter(x => x.kind === fKind) : SI;
  const title = fKind || "전체현황";
  return <div>
    <PH title="특별점검" bc="홈 > 특별점검" />
    <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 14 }}>
      <Card title="점검종류" style={{ position: "sticky", top: 20, maxHeight: "calc(100vh - 170px)", overflow: "hidden", display: "flex", flexDirection: "column" }}><InspFilter menus={_specMenu} sel={fKind} sub={null} onSelect={(k) => setFKind(k)} data={SI} /></Card>
      <div style={{ minWidth: 0 }}>
        <SB ph="제목, ID, 정보시스템 검색" />
        <Tbl secTitle={title} secCount={filtered.length} cols={[
          { t: "상태", k: "st", w: 80, r: v => <Badge status={v} /> },
          { t: "점검 제목", k: "title", w: 200, align: "left", r: (v, row) => <span onClick={e => { e.stopPropagation(); setSelItem(row); }} style={{ fontWeight: 600, color: C.pri, cursor: "pointer" }}>{v}</span> },
          { t: "정보시스템", k: "sysNm" },
          { t: "점검종류", k: "kind" },
          { t: "기한", k: "due" },
          { t: "점검자", k: "insp" },
          { t: "제출일시", k: "submitDt" },
          { t: "", k: "id", w: 90, r: (_, row) => row.st !== "완료"
            ? <Btn primary small onClick={e => { e.stopPropagation(); setSelItem(row); }}>점검수행</Btn>
            : <span style={{ fontSize: 11, color: C.txL }}>완료</span> },
        ]} data={filtered} />
      </div>
    </div>
    <SpecialPanel open={!!selItem} onClose={() => setSelItem(null)} item={selItem} canReport />
  </div>;
};

/* ── MgrCategory (카테고리 관리 - 3Depth) ── */
const MgrCategory = () => {
  /* 샘플 3depth 카테고리 트리 */
  const initTree = [
    { id: "c1", nm: "서버", children: [
      { id: "c1-1", nm: "CPU", children: [{ id: "c1-1-1", nm: "사용률" }, { id: "c1-1-2", nm: "코어별" }, { id: "c1-1-3", nm: "대기 큐" }] },
      { id: "c1-2", nm: "메모리", children: [{ id: "c1-2-1", nm: "사용률" }, { id: "c1-2-2", nm: "SWAP" }, { id: "c1-2-3", nm: "캐시" }] },
      { id: "c1-3", nm: "디스크", children: [{ id: "c1-3-1", nm: "사용률" }, { id: "c1-3-2", nm: "I/O" }, { id: "c1-3-3", nm: "inode" }, { id: "c1-3-4", nm: "파일시스템" }] },
      { id: "c1-4", nm: "프로세스", children: [{ id: "c1-4-1", nm: "구동상태" }, { id: "c1-4-2", nm: "좀비" }, { id: "c1-4-3", nm: "한계" }] },
      { id: "c1-5", nm: "서비스", children: [{ id: "c1-5-1", nm: "포트" }, { id: "c1-5-2", nm: "SSH" }, { id: "c1-5-3", nm: "NTP" }, { id: "c1-5-4", nm: "DNS" }] },
      { id: "c1-6", nm: "OS", children: [{ id: "c1-6-1", nm: "커널" }, { id: "c1-6-2", nm: "Uptime" }, { id: "c1-6-3", nm: "시간" }] },
      { id: "c1-7", nm: "로그", children: [{ id: "c1-7-1", nm: "에러" }, { id: "c1-7-2", nm: "용량" }, { id: "c1-7-3", nm: "감사" }, { id: "c1-7-4", nm: "로테이션" }] },
    ]},
    { id: "c2", nm: "보안", children: [
      { id: "c2-1", nm: "패치", children: [{ id: "c2-1-1", nm: "상태" }, { id: "c2-1-2", nm: "긴급" }] },
      { id: "c2-2", nm: "접근통제", children: [{ id: "c2-2-1", nm: "방화벽" }, { id: "c2-2-2", nm: "포트" }, { id: "c2-2-3", nm: "원격접속" }, { id: "c2-2-4", nm: "암호화" }, { id: "c2-2-5", nm: "IPS/IDS" }] },
      { id: "c2-3", nm: "계정관리", children: [{ id: "c2-3-1", nm: "패스워드" }, { id: "c2-3-2", nm: "잠김정책" }, { id: "c2-3-3", nm: "세션" }, { id: "c2-3-4", nm: "불필요계정" }, { id: "c2-3-5", nm: "권한" }] },
      { id: "c2-4", nm: "인증서", children: [{ id: "c2-4-1", nm: "만료" }, { id: "c2-4-2", nm: "SSL" }] },
    ]},
    { id: "c3", nm: "네트워크", children: [
      { id: "c3-1", nm: "인터페이스", children: [{ id: "c3-1-1", nm: "상태" }, { id: "c3-1-2", nm: "트래픽" }, { id: "c3-1-3", nm: "대역폭" }] },
      { id: "c3-2", nm: "품질", children: [{ id: "c3-2-1", nm: "패킷손실" }, { id: "c3-2-2", nm: "지연시간" }] },
      { id: "c3-3", nm: "설정", children: [{ id: "c3-3-1", nm: "ARP" }, { id: "c3-3-2", nm: "라우팅" }, { id: "c3-3-3", nm: "VLAN" }] },
    ]},
    { id: "c4", nm: "WEB", children: [
      { id: "c4-1", nm: "응답", children: [{ id: "c4-1-1", nm: "응답코드" }, { id: "c4-1-2", nm: "응답시간" }, { id: "c4-1-3", nm: "정적리소스" }] },
      { id: "c4-2", nm: "프로세스", children: [{ id: "c4-2-1", nm: "상태" }, { id: "c4-2-2", nm: "커넥션" }, { id: "c4-2-3", nm: "쓰레드" }] },
      { id: "c4-3", nm: "로그", children: [{ id: "c4-3-1", nm: "에러" }, { id: "c4-3-2", nm: "접근" }] },
    ]},
    { id: "c5", nm: "WAS", children: [
      { id: "c5-1", nm: "리소스", children: [{ id: "c5-1-1", nm: "프로세스" }, { id: "c5-1-2", nm: "힙메모리" }, { id: "c5-1-3", nm: "쓰레드" }, { id: "c5-1-4", nm: "GC" }] },
      { id: "c5-2", nm: "커넥션", children: [{ id: "c5-2-1", nm: "JDBC" }, { id: "c5-2-2", nm: "세션" }] },
      { id: "c5-3", nm: "로그/배포", children: [{ id: "c5-3-1", nm: "에러" }, { id: "c5-3-2", nm: "배포" }] },
    ]},
    { id: "c6", nm: "DBMS", children: [
      { id: "c6-1", nm: "상태", children: [{ id: "c6-1-1", nm: "서비스" }, { id: "c6-1-2", nm: "커넥션" }, { id: "c6-1-3", nm: "복제" }] },
      { id: "c6-2", nm: "저장소", children: [{ id: "c6-2-1", nm: "테이블스페이스" }, { id: "c6-2-2", nm: "아카이브" }] },
      { id: "c6-3", nm: "성능", children: [{ id: "c6-3-1", nm: "슬로우쿼리" }, { id: "c6-3-2", nm: "데드락" }, { id: "c6-3-3", nm: "Lock" }, { id: "c6-3-4", nm: "인덱스" }] },
      { id: "c6-4", nm: "로그", children: [{ id: "c6-4-1", nm: "에러" }] },
    ]},
    { id: "c7", nm: "운영", children: [
      { id: "c7-1", nm: "백업", children: [{ id: "c7-1-1", nm: "상태" }, { id: "c7-1-2", nm: "전체" }, { id: "c7-1-3", nm: "증분" }, { id: "c7-1-4", nm: "용량" }, { id: "c7-1-5", nm: "복원" }] },
      { id: "c7-2", nm: "이중화", children: [{ id: "c7-2-1", nm: "상태" }, { id: "c7-2-2", nm: "절체" }, { id: "c7-2-3", nm: "클러스터" }, { id: "c7-2-4", nm: "Heartbeat" }] },
      { id: "c7-3", nm: "성능", children: [{ id: "c7-3-1", nm: "TPS" }, { id: "c7-3-2", nm: "응답시간" }, { id: "c7-3-3", nm: "동시접속" }, { id: "c7-3-4", nm: "부하테스트" }] },
    ]},
    { id: "c8", nm: "하드웨어", children: [
      { id: "c8-1", nm: "전원", children: [{ id: "c8-1-1", nm: "PSU" }, { id: "c8-1-2", nm: "UPS" }] },
      { id: "c8-2", nm: "냉각", children: [{ id: "c8-2-1", nm: "온도" }, { id: "c8-2-2", nm: "팬" }] },
      { id: "c8-3", nm: "스토리지", children: [{ id: "c8-3-1", nm: "RAID" }, { id: "c8-3-2", nm: "SMART" }] },
    ]},
  ];

  const [tree, setTree] = useState(initTree);
  const [sel1, setSel1] = useState(null);
  const [sel2, setSel2] = useState(null);
  const [sel3, setSel3] = useState(null);
  const [editId, setEditId] = useState(null);
  const [editNm, setEditNm] = useState("");

  const depth2 = sel1 ? (tree.find(c => c.id === sel1)?.children || []) : [];
  const depth3 = sel2 ? (depth2.find(c => c.id === sel2)?.children || []) : [];

  const genId = (prefix) => prefix + "-" + Date.now();

  /* 추가 - 인라인 입력 방식 */
  const [addDepth, setAddDepth] = useState(null);
  const [addNm, setAddNm] = useState("");

  const startAdd = (depth) => { setAddDepth(depth); setAddNm(""); };
  const cancelAdd = () => { setAddDepth(null); setAddNm(""); };
  const commitAdd = () => {
    if (!addNm.trim()) { cancelAdd(); return; }
    const nm = addNm.trim();
    if (addDepth === 1) setTree(p => [...p, { id: genId("c"), nm, children: [] }]);
    if (addDepth === 2 && sel1) setTree(p => p.map(c => c.id === sel1 ? { ...c, children: [...c.children, { id: genId("c2"), nm, children: [] }] } : c));
    if (addDepth === 3 && sel1 && sel2) setTree(p => p.map(c1 => c1.id === sel1 ? { ...c1, children: c1.children.map(c2 => c2.id === sel2 ? { ...c2, children: [...c2.children, { id: genId("c3"), nm }] } : c2) } : c1));
    cancelAdd();
  };

  /* 삭제 */
  const delCat1 = (id) => { setTree(p => p.filter(c => c.id !== id)); if (sel1 === id) { setSel1(null); setSel2(null); setSel3(null); } };
  const delCat2 = (id) => { setTree(p => p.map(c1 => c1.id === sel1 ? { ...c1, children: c1.children.filter(c2 => c2.id !== id) } : c1)); if (sel2 === id) { setSel2(null); setSel3(null); } };
  const delCat3 = (id) => { setTree(p => p.map(c1 => c1.id === sel1 ? { ...c1, children: c1.children.map(c2 => c2.id === sel2 ? { ...c2, children: c2.children.filter(c3 => c3.id !== id) } : c2) } : c1)); if (sel3 === id) setSel3(null); };

  /* 인라인 편집 */
  const startEdit = (id, nm) => { setEditId(id); setEditNm(nm); };
  const saveEdit = (depth) => {
    if (!editNm.trim()) { setEditId(null); return; }
    if (depth === 1) setTree(p => p.map(c => c.id === editId ? { ...c, nm: editNm.trim() } : c));
    if (depth === 2) setTree(p => p.map(c1 => c1.id === sel1 ? { ...c1, children: c1.children.map(c2 => c2.id === editId ? { ...c2, nm: editNm.trim() } : c2) } : c1));
    if (depth === 3) setTree(p => p.map(c1 => c1.id === sel1 ? { ...c1, children: c1.children.map(c2 => c2.id === sel2 ? { ...c2, children: c2.children.map(c3 => c3.id === editId ? { ...c3, nm: editNm.trim() } : c3) } : c2) } : c1));
    setEditId(null);
  };

  const colHeader = (label, count, onAdd) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderBottom: `2px solid ${C.brd}`, background: "#F9FAFC" }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: C.txt }}>{label} <span style={{ fontWeight: 400, fontSize: 11, color: C.txL }}>({count})</span></div>
      <span onClick={onAdd} style={{ cursor: "pointer", fontSize: 18, color: C.pri, fontWeight: 700, lineHeight: 1 }} title={`${label} 추가`}>+</span>
    </div>
  );

  const catRow = (item, isActive, onSelect, onDel, depth) => (
    <div
      key={item.id}
      onClick={() => editId !== item.id && onSelect(item.id)}
      style={{
        display: "flex", alignItems: "center", padding: "9px 14px", cursor: "pointer",
        background: isActive ? C.priL : "", borderBottom: `1px solid ${C.brd}`,
        transition: "all .3s"
      }}
      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = "#F9FAFC"; }}
      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = ""; }}
    >
      {editId === item.id ? (
        <input
          autoFocus
          value={editNm}
          onChange={e => setEditNm(e.target.value)}
          onBlur={() => saveEdit(depth)}
          onKeyDown={e => { if (e.key === "Enter") saveEdit(depth); if (e.key === "Escape") setEditId(null); }}
          onClick={e => e.stopPropagation()}
          style={{ flex: 1, padding: "2px 6px", border: `1px solid ${C.pri}`, borderRadius: 4, fontSize: 13, outline: "none" }}
        />
      ) : (
        <span style={{ flex: 1, fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? C.priD : C.txt }}>{item.nm}</span>
      )}
      {item.children && <span style={{ fontSize: 10, color: C.txL, marginRight: 6 }}>{item.children.length}</span>}
      {editId !== item.id && <>
        <span onClick={e => { e.stopPropagation(); startEdit(item.id, item.nm); }} style={{ cursor: "pointer", fontSize: 11, color: C.txL, marginRight: 6, padding: "0 2px" }} title="수정"><Ic n="edit" s={13} c={C.txL} /></span>
        <span onClick={e => { e.stopPropagation(); onDel(item.id); }} style={{ cursor: "pointer", fontSize: 14, color: C.red, fontWeight: 600 }} title="삭제">×</span>
      </>}
    </div>
  );

  const addInputRow = (depth) => addDepth === depth && (
    <div style={{ display: "flex", alignItems: "center", padding: "6px 14px", borderBottom: `1px solid ${C.brd}`, background: "#f0fdf4" }}>
      <input
        autoFocus
        value={addNm}
        onChange={e => setAddNm(e.target.value)}
        onBlur={commitAdd}
        onKeyDown={e => { if (e.key === "Enter") commitAdd(); if (e.key === "Escape") cancelAdd(); }}
        placeholder="이름 입력 후 Enter"
        style={{ flex: 1, padding: "4px 8px", border: `1px solid ${C.pri}`, borderRadius: 4, fontSize: 13, outline: "none" }}
      />
      <span onClick={cancelAdd} style={{ cursor: "pointer", marginLeft: 8, fontSize: 13, color: C.txL }}>취소</span>
    </div>
  );

  return <div>
    <PH title="카테고리 관리" bc="홈 > 환경설정 > 카테고리 관리" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", border: `1px solid ${C.brd}`, borderRadius: 8, overflow: "hidden", minHeight: 400 }}>
        {/* 1Depth 대분류 */}
        <div style={{ borderRight: `1px solid ${C.brd}` }}>
          {colHeader("1 Depth 대분류", tree.length, () => startAdd(1))}
          <div style={{ maxHeight: 500, overflowY: "auto" }}>
            {tree.map(c => catRow(c, sel1 === c.id, (id) => { setSel1(id); setSel2(null); setSel3(null); }, delCat1, 1))}
            {addInputRow(1)}
            {tree.length === 0 && addDepth !== 1 && <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: C.txL }}>대분류가 없습니다.<br/>+ 버튼으로 추가하세요.</div>}
          </div>
        </div>
        {/* 2Depth 중분류 */}
        <div style={{ borderRight: `1px solid ${C.brd}` }}>
          {colHeader("2 Depth 중분류", depth2.length, () => sel1 && startAdd(2))}
          <div style={{ maxHeight: 500, overflowY: "auto" }}>
            {sel1 ? depth2.map(c => catRow(c, sel2 === c.id, (id) => { setSel2(id); setSel3(null); }, delCat2, 2)) : <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: C.txL }}>대분류를 선택하세요</div>}
            {sel1 && addInputRow(2)}
            {sel1 && depth2.length === 0 && addDepth !== 2 && <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: C.txL }}>중분류가 없습니다.<br/>+ 버튼으로 추가하세요.</div>}
          </div>
        </div>
        {/* 3Depth 소분류 */}
        <div>
          {colHeader("3 Depth 소분류", depth3.length, () => sel2 && startAdd(3))}
          <div style={{ maxHeight: 500, overflowY: "auto" }}>
            {sel2 ? depth3.map(c => catRow(c, sel3 === c.id, setSel3, delCat3, 3)) : <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: C.txL }}>중분류를 선택하세요</div>}
            {sel2 && addInputRow(3)}
            {sel2 && depth3.length === 0 && addDepth !== 3 && <div style={{ padding: 20, textAlign: "center", fontSize: 12, color: C.txL }}>소분류가 없습니다.<br/>+ 버튼으로 추가하세요.</div>}
          </div>
        </div>
      </div>
  </div>;
};



/* ── 공통코드 관리 ── */
const MgrCode = () => {
  const INIT_GROUPS = [
    { id:"GRP001", nm:"자원유형",     desc:"자원 대분류/중분류/소분류 구분 코드", cnt:6, useYn:"Y", regDt:"2026-01-10" },
    { id:"GRP002", nm:"점검상태",     desc:"점검 진행 상태 코드",               cnt:4, useYn:"Y", regDt:"2026-01-10" },
    { id:"GRP003", nm:"점검결과",     desc:"점검 결과 판정 코드",               cnt:2, useYn:"Y", regDt:"2026-01-10" },
    { id:"GRP004", nm:"사용자역할",   desc:"시스템 내 사용자 권한 유형",         cnt:4, useYn:"Y", regDt:"2026-01-10" },
    { id:"GRP005", nm:"점검유형",     desc:"일상/특별 점검 유형 코드",           cnt:2, useYn:"Y", regDt:"2026-01-11" },
    { id:"GRP006", nm:"특별점검종류", desc:"특별점검 세부 종류 코드",            cnt:4, useYn:"Y", regDt:"2026-01-11" },
    { id:"GRP007", nm:"정기점검주기", desc:"정기점검 반복 주기 코드",            cnt:3, useYn:"Y", regDt:"2026-01-12" },
    { id:"GRP008", nm:"알림유형",     desc:"발송 알림 종류 코드",               cnt:5, useYn:"Y", regDt:"2026-01-15" },
    { id:"GRP009", nm:"파일유형",     desc:"첨부 가능한 파일 형식 코드",         cnt:8, useYn:"N", regDt:"2026-01-20" },
    { id:"GRP010", nm:"시스템유형",   desc:"정보시스템 유형 분류 코드",          cnt:3, useYn:"Y", regDt:"2026-01-20" },
  ];
  const INIT_CODES = {
    GRP001: [
      { id:"C001001", grpId:"GRP001", cd:"HW",  nm:"하드웨어",  desc:"물리 서버·장비",      sort:1, useYn:"Y", regDt:"2026-01-10" },
      { id:"C001002", grpId:"GRP001", cd:"SW",  nm:"소프트웨어",desc:"OS·미들웨어·앱",      sort:2, useYn:"Y", regDt:"2026-01-10" },
      { id:"C001003", grpId:"GRP001", cd:"NW",  nm:"네트워크",  desc:"스위치·라우터·방화벽", sort:3, useYn:"Y", regDt:"2026-01-10" },
      { id:"C001004", grpId:"GRP001", cd:"SEC", nm:"보안",      desc:"보안 장비 및 솔루션",  sort:4, useYn:"Y", regDt:"2026-01-10" },
      { id:"C001005", grpId:"GRP001", cd:"DB",  nm:"DBMS",     desc:"데이터베이스 서버",     sort:5, useYn:"Y", regDt:"2026-01-10" },
      { id:"C001006", grpId:"GRP001", cd:"WAS", nm:"WAS",      desc:"웹 애플리케이션 서버",  sort:6, useYn:"Y", regDt:"2026-01-10" },
    ],
    GRP002: [
      { id:"C002001", grpId:"GRP002", cd:"SCH",  nm:"예정", desc:"점검 예정 상태",  sort:1, useYn:"Y", regDt:"2026-01-10" },
      { id:"C002002", grpId:"GRP002", cd:"ING",  nm:"진행", desc:"점검 진행 중",    sort:2, useYn:"Y", regDt:"2026-01-10" },
      { id:"C002003", grpId:"GRP002", cd:"DLY",  nm:"지연", desc:"기한 초과 지연",  sort:3, useYn:"Y", regDt:"2026-01-10" },
      { id:"C002004", grpId:"GRP002", cd:"DONE", nm:"완료", desc:"점검 완료 상태",  sort:4, useYn:"Y", regDt:"2026-01-10" },
    ],
    GRP003: [
      { id:"C003001", grpId:"GRP003", cd:"OK", nm:"정상",   desc:"정상 판정",   sort:1, useYn:"Y", regDt:"2026-01-10" },
      { id:"C003002", grpId:"GRP003", cd:"NG", nm:"비정상", desc:"비정상 판정", sort:2, useYn:"Y", regDt:"2026-01-10" },
    ],
    GRP004: [
      { id:"C004001", grpId:"GRP004", cd:"SYS", nm:"시스템 관리자", desc:"전체 권한",      sort:1, useYn:"Y", regDt:"2026-01-10" },
      { id:"C004002", grpId:"GRP004", cd:"ORG", nm:"기관 관리자",   desc:"기관 범위 권한", sort:2, useYn:"Y", regDt:"2026-01-10" },
      { id:"C004003", grpId:"GRP004", cd:"MNT", nm:"유지보수 총괄", desc:"점검 운영 권한", sort:3, useYn:"Y", regDt:"2026-01-10" },
      { id:"C004004", grpId:"GRP004", cd:"USR", nm:"사용자",        desc:"점검 수행 권한", sort:4, useYn:"Y", regDt:"2026-01-10" },
    ],
  };

  const EMPTY_GRP  = { id:"", nm:"", desc:"", useYn:"Y" };
  const EMPTY_CODE = { id:"", cd:"", nm:"", desc:"", sort:1, useYn:"Y" };

  const [groups,     setGroups]     = useState(INIT_GROUPS);
  const [codes,      setCodes]      = useState(INIT_CODES);
  const [selGrp,     setSelGrp]     = useState(INIT_GROUPS[0]);
  const [grpQ,       setGrpQ]       = useState("");
  const [codeQ,      setCodeQ]      = useState("");

  /* 그룹 패널 - isNew: 신규 추가 모드 */
  const [grpPanel,   setGrpPanel]   = useState(false);
  const [grpForm,    setGrpForm]    = useState(EMPTY_GRP);
  const [grpIsNew,   setGrpIsNew]   = useState(false);
  const [grpErrors,  setGrpErrors]  = useState({});
  const [grpDel,     setGrpDel]     = useState(null);

  /* 코드 패널 */
  const [codePanel,  setCodePanel]  = useState(false);
  const [codeForm,   setCodeForm]   = useState(EMPTY_CODE);
  const [codeIsNew,  setCodeIsNew]  = useState(false);
  const [codeErrors, setCodeErrors] = useState({});
  const [codeDel,    setCodeDel]    = useState(null);

  const [showUpload, setShowUpload] = useState(false);

  const sgf = (k,v) => setGrpForm(p=>({...p,[k]:v}));
  const scf = (k,v) => setCodeForm(p=>({...p,[k]:v}));

  const filteredGroups = groups.filter(g => !grpQ || g.nm.includes(grpQ) || g.id.includes(grpQ));
  const curCodes = (codes[selGrp?.id]||[])
    .filter(c => !codeQ || c.nm.includes(codeQ) || c.cd.includes(codeQ))
    .sort((a,b)=>a.sort-b.sort);

  /* 그룹 행 클릭 → 좌측은 selGrp 변경, 더블클릭 또는 아이콘 클릭 → 패널 오픈 */
  const openGrpPanel = (g, isNew=false) => {
    setGrpIsNew(isNew);
    setGrpForm(isNew ? EMPTY_GRP : {...g});
    setGrpErrors({});
    setGrpPanel(true);
  };

  /* 코드 행 클릭 → 패널 오픈 */
  const openCodePanel = (c, isNew=false) => {
    setCodeIsNew(isNew);
    setCodeForm(isNew ? {...EMPTY_CODE, sort:(codes[selGrp?.id]||[]).length+1} : {...c});
    setCodeErrors({});
    setCodePanel(true);
  };

  const saveGroup = () => {
    const e = {};
    if (!grpForm.id.trim()) e.id = "그룹 ID를 입력하세요.";
    if (!grpForm.nm.trim()) e.nm = "그룹명을 입력하세요.";
    setGrpErrors(e);
    if (Object.keys(e).length) return;
    if (grpIsNew) {
      if (groups.some(g=>g.id===grpForm.id)) { setGrpErrors({id:"이미 존재하는 그룹 ID입니다."}); return; }
      setGroups(p=>[...p, {...grpForm, cnt:0, regDt:"2026-02-24"}]);
    } else {
      setGroups(p=>p.map(g=>g.id===grpForm.id ? {...g,...grpForm} : g));
      if (selGrp?.id===grpForm.id) setSelGrp(prev=>({...prev,...grpForm}));
    }
    setGrpPanel(false);
  };

  const saveCode = () => {
    const e = {};
    if (!codeForm.cd.trim()) e.cd = "코드값을 입력하세요.";
    if (!codeForm.nm.trim()) e.nm = "코드명을 입력하세요.";
    setCodeErrors(e);
    if (Object.keys(e).length) return;
    if (codeIsNew) {
      const nc = {...codeForm, id:`${selGrp.id}_${Date.now()}`, grpId:selGrp.id, regDt:"2026-02-24"};
      setCodes(p=>({...p, [selGrp.id]:[...(p[selGrp.id]||[]), nc]}));
      setGroups(p=>p.map(g=>g.id===selGrp.id ? {...g, cnt:g.cnt+1} : g));
    } else {
      setCodes(p=>({...p, [selGrp.id]: p[selGrp.id].map(c=>c.id===codeForm.id ? {...c,...codeForm} : c)}));
    }
    setCodePanel(false);
  };

  const deleteGroup = (id) => {
    setGroups(p=>p.filter(g=>g.id!==id));
    if (selGrp?.id===id) setSelGrp(groups.find(g=>g.id!==id)||null);
    setGrpDel(null); setGrpPanel(false);
  };
  const deleteCode = (cid) => {
    setCodes(p=>({...p, [selGrp.id]:(p[selGrp.id]||[]).filter(c=>c.id!==cid)}));
    setGroups(p=>p.map(g=>g.id===selGrp.id ? {...g, cnt:Math.max(0,g.cnt-1)} : g));
    setCodeDel(null); setCodePanel(false);
  };

  const inp = {...fInput};
  const ro  = {background:"#f0f1f3", color:C.txS, pointerEvents:"none"};
  const err = (msg) => msg ? <div style={{fontSize:11,color:"#ef4444",marginTop:3}}>{msg}</div> : null;

  const UseRadio = ({val, onChange}) => (
    <div style={{display:"flex",gap:16}}>
      {[["Y","사용"],["N","미사용"]].map(([v,l])=>(
        <label key={v} style={{display:"flex",alignItems:"center",gap:5,fontSize:13,cursor:"pointer"}}>
          <input type="radio" checked={val===v} onChange={()=>onChange(v)} />{l}
        </label>
      ))}
    </div>
  );

  const BadgeUse = ({v}) => (
    <span style={{padding:"2px 8px", borderRadius:10, fontSize:11, fontWeight:600,
      background:v==="Y"?"#dcfce7":"#F9FAFC", color:v==="Y"?"#16a34a":"#929292"}}>
      {v==="Y"?"사용":"미사용"}
    </span>
  );

  const ConfirmModal = ({title, msg, onOk, onCancel}) => (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:1100,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#fff",borderRadius:12,padding:28,width:340,boxShadow:"0 8px 32px rgba(0,0,0,.2)"}}>
        <div style={{fontSize:15,fontWeight:700,marginBottom:8,color:"#ef4444"}}>{title}</div>
        <div style={{fontSize:13,color:C.txS,marginBottom:20}}>{msg}</div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
          <Btn onClick={onCancel}>취소</Btn>
          <button onClick={onOk} style={{padding:"7px 16px",fontSize:13,background:"#ef4444",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontWeight:600}}>삭제</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <PH title="공통코드" bc="홈 > 환경설정 > 공통코드" />

      <div style={{display:"flex", gap:20, maxHeight:"calc(100vh - 170px)", boxSizing:"border-box"}}>

        {/* ── 좌: 코드 그룹 ── */}
        <div style={{width:240, flexShrink:0, display:"flex", flexDirection:"column", background:"#fff", border:`1px solid ${C.brd}`, borderRadius:10, overflow:"hidden"}}>
          <div style={{padding:"14px 16px", borderBottom:`1px solid ${C.brd}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0}}>
            <span style={{fontSize:13, fontWeight:700, color:C.txt}}>코드</span>
            <div style={{display:"flex", gap:6}}>
              <Btn primary small onClick={()=>openGrpPanel(null, true)}>+ 추가</Btn>
            </div>
          </div>
          <div style={{padding:"10px 12px", borderBottom:`1px solid ${C.brd}`, flexShrink:0}}>
            <input value={grpQ} onChange={e=>setGrpQ(e.target.value)} placeholder="그룹 검색..."
              style={{...inp, fontSize:12, padding:"6px 10px"}} />
          </div>
          <div style={{flex:1, overflowY:"auto"}}>
            {filteredGroups.map(g => {
              const sel = selGrp?.id===g.id;
              return (
                <div key={g.id}
                  onClick={()=>{ setSelGrp(g); setCodeQ(""); setCodePanel(false); }}
                  onDoubleClick={()=>openGrpPanel(g, false)}
                  title="더블클릭하면 그룹을 수정할 수 있습니다"
                  style={{padding:"9px 14px", cursor:"pointer", borderRadius:6, margin:"1px 6px",
                    background:sel?C.priL:"transparent", transition:"all .3s"}}
                  onMouseEnter={e => { if (!sel) e.currentTarget.style.background = C.secL; }}
                  onMouseLeave={e => { if (!sel) e.currentTarget.style.background = sel ? C.priL : "transparent"; }}>
                  <div style={{display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                    <div style={{display:"flex", alignItems:"center", gap:6, flex:1, minWidth:0}}>
                      <span style={{fontSize:14, fontWeight:sel?600:500, color:sel?C.sec:C.txt, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{g.nm}</span>
                      {g.useYn==="N" && <span style={{fontSize:10,padding:"1px 5px",borderRadius:3,background:"#F9FAFC",color:C.txL}}>미사용</span>}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                      <span style={{fontSize:11, color:C.txL, background:"#F9FAFC", borderRadius:10, padding:"1px 7px"}}>{g.cnt}</span>
                      <button
                        onClick={e => { e.stopPropagation(); openGrpPanel(g, false); }}
                        style={{ width:24, height:24, border:`1px solid ${C.brd}`, borderRadius:4, background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.txL, flexShrink:0 }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.secL; e.currentTarget.style.color = C.pri; e.currentTarget.style.borderColor = C.pri; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = C.txL; e.currentTarget.style.borderColor = C.brd; }}
                        title="수정">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                          <circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div style={{fontSize:11, color:C.txL, marginTop:2, fontFamily:"monospace"}}>{g.id}</div>
                </div>
              );
            })}
            {!filteredGroups.length && <div style={{padding:30,textAlign:"center",color:C.txL,fontSize:12}}>검색 결과 없음</div>}
          </div>
        </div>

        {/* ── 우: 코드 목록 ── */}
        <div style={{flex:1, minWidth:0}}>
          {!selGrp ? (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",color:C.txL}}>
              <div style={{fontSize:36,marginBottom:10}}>☰</div>
              <div style={{fontSize:13}}>왼쪽에서 코드 그룹을 선택하세요.</div>
            </div>
          ) : (<>
            <SB ph="코드값 또는 코드명 검색" />
            <Tbl secTitle={`${selGrp.nm} 코드 목록`} secCount={curCodes.length} secButtons={<div style={{display:"flex",gap:4}}>
              <Btn small onClick={()=>setShowUpload(true)}>📤 엑셀 업로드</Btn>
              <Btn small>📥 엑셀 다운로드</Btn>
              <SecBtnP onClick={()=>openCodePanel(null, true)}>+ 코드 추가</SecBtnP>
            </div>} cols={[
              { t: "순서", k: "sort" },
              { t: "코드값", k: "cd", r: v => <span style={{fontFamily:"monospace",fontSize:13,padding:"2px 8px",background:C.priL,borderRadius:4,color:C.pri,fontWeight:700}}>{v}</span> },
              { t: "항목", k: "nm", r: (v, row) => <span onClick={e => { e.stopPropagation(); openCodePanel(row, false); }} style={{fontWeight:600,color:C.pri,cursor:"pointer"}}>{v}</span> },
              { t: "설명", k: "desc", r: v => v || "—" },
              { t: "사용여부", k: "useYn", r: v => <BadgeUse v={v} /> },
              { t: "등록일", k: "regDt" },
            ]} data={curCodes} />
          </>)}
        </div>
      </div>

      {/* ── 사이드 패널: 코드 그룹 ── */}
      <SidePanel open={grpPanel} onClose={()=>setGrpPanel(false)}
        title={grpIsNew ? "코드 그룹 추가" : "코드 그룹 수정"} width={480}>
        {!grpIsNew && <PanelDeleteBtn onClick={()=>setGrpDel(grpForm.id)} />}
        <SecTitle label="그룹 정보" primary />
        <FormRow label="그룹 ID" required>
          <input value={grpForm.id} onChange={e=>sgf("id",e.target.value.toUpperCase())}
            placeholder="예) GRP011" maxLength={20}
            style={{...inp,...(!grpIsNew?ro:{})}} readOnly={!grpIsNew} />
          {err(grpErrors.id)}
        </FormRow>
        <FormRow label="그룹명" required>
          <input value={grpForm.nm} onChange={e=>sgf("nm",e.target.value)}
            placeholder="예) 자원유형" style={inp} maxLength={50} />
          {err(grpErrors.nm)}
        </FormRow>
        <FormRow label="설명">
          <textarea value={grpForm.desc} onChange={e=>sgf("desc",e.target.value)}
            placeholder="코드 그룹에 대한 설명을 입력하세요" rows={3}
            style={{...inp, resize:"none", fontFamily:"inherit"}} maxLength={200} />
        </FormRow>
        <FormRow label="사용여부">
          <UseRadio val={grpForm.useYn} onChange={v=>sgf("useYn",v)} />
        </FormRow>
        <PanelFooter onCancel={()=>setGrpPanel(false)} onSave={saveGroup}
          saveLabel={grpIsNew?"등록":"저장"} />
      </SidePanel>

      {/* ── 사이드 패널: 코드 ── */}
      <SidePanel open={codePanel} onClose={()=>setCodePanel(false)}
        title={codeIsNew ? "코드 추가" : "코드 수정"} width={480}>
        {!codeIsNew && <PanelDeleteBtn onClick={()=>setCodeDel(codeForm.id)} />}
        <SecTitle label="코드 정보" primary />
        <div style={{display:"flex",gap:12}}>
          <div style={{flex:1}}>
            <FormRow label="코드값" required>
              <input value={codeForm.cd} onChange={e=>scf("cd",e.target.value.toUpperCase())}
                placeholder="예) HW" maxLength={30}
                style={{...inp,...(!codeIsNew?ro:{})}} readOnly={!codeIsNew} />
              {err(codeErrors.cd)}
            </FormRow>
          </div>
          <div style={{width:80}}>
            <FormRow label="순서">
              <input type="number" min={1} value={codeForm.sort}
                onChange={e=>scf("sort",parseInt(e.target.value)||1)} style={inp} />
            </FormRow>
          </div>
        </div>
        <FormRow label="코드명" required>
          <input value={codeForm.nm} onChange={e=>scf("nm",e.target.value)}
            placeholder="예) 하드웨어" style={inp} maxLength={50} />
          {err(codeErrors.nm)}
        </FormRow>
        <FormRow label="설명">
          <textarea value={codeForm.desc} onChange={e=>scf("desc",e.target.value)}
            placeholder="코드에 대한 설명" rows={2}
            style={{...inp, resize:"none", fontFamily:"inherit"}} maxLength={200} />
        </FormRow>
        <FormRow label="사용여부">
          <UseRadio val={codeForm.useYn} onChange={v=>scf("useYn",v)} />
        </FormRow>
        <PanelFooter onCancel={()=>setCodePanel(false)} onSave={saveCode}
          saveLabel={codeIsNew?"등록":"저장"} />
      </SidePanel>

      {/* ── 엑셀 업로드 모달 ── */}
      {showUpload && (
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{background:"#fff",borderRadius:12,padding:32,width:440,boxShadow:"0 12px 40px rgba(0,0,0,.18)"}}>
            <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>엑셀 업로드</div>
            <div style={{fontSize:12,color:C.txS,marginBottom:20}}>엑셀 파일을 업로드하면 코드 그룹 및 코드가 일괄 등록됩니다.</div>
            <div style={{border:`2px dashed ${C.brd}`,borderRadius:8,padding:"30px 0",textAlign:"center",marginBottom:16,color:C.txL,cursor:"pointer",background:"#f8fafc"}}>
              <div style={{fontSize:28,marginBottom:8}}>📂</div>
              <div style={{fontSize:13}}>파일을 드래그하거나 클릭하여 선택</div>
              <div style={{fontSize:11,marginTop:4}}>.xlsx, .xls 형식 지원 / 최대 5MB</div>
            </div>
            <div style={{fontSize:11,color:C.pri,marginBottom:20,cursor:"pointer"}}>▼ 업로드 양식 다운로드</div>
            <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
              <Btn onClick={()=>setShowUpload(false)}>취소</Btn>
              <Btn primary onClick={()=>setShowUpload(false)}>업로드</Btn>
            </div>
          </div>
        </div>
      )}

      {grpDel && <ConfirmModal title="코드 그룹 삭제" msg="해당 그룹과 하위 코드 전체가 삭제됩니다. 계속하시겠습니까?"
        onOk={()=>deleteGroup(grpDel)} onCancel={()=>setGrpDel(null)} />}
      {codeDel && <ConfirmModal title="코드 삭제" msg="선택한 코드를 삭제합니다. 계속하시겠습니까?"
        onOk={()=>deleteCode(codeDel)} onCancel={()=>setCodeDel(null)} />}
    </div>
  );
};



/* ── 로그인 안내메시지 관리 ── */
const MgrLoginMsg = ({ loginMsg, onSave }) => {
  const MAX_LEN = 500;
  const [form, setForm] = useState({ content: loginMsg || "", useYn: loginMsg ? "Y" : "N" });
  const [errors, setErrors] = useState({});
  const [saveOk, setSaveOk] = useState(false);

  const sf = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSave = () => {
    const e = {};
    if (form.useYn === "Y" && !form.content.trim()) e.content = "안내 메시지를 입력하세요.";
    if (form.content.length > MAX_LEN) e.content = MAX_LEN + "자 이내로 입력하세요.";
    setErrors(e);
    if (Object.keys(e).length) return;
    onSave(form.useYn === "Y" ? form.content : "");
    setSaveOk(true);
    setTimeout(() => setSaveOk(false), 2000);
  };

  const remaining = MAX_LEN - form.content.length;

  const UseRadio = ({ val, onChange }) => (
    <div style={{ display: "flex", gap: 16 }}>
      {[["Y", "노출"], ["N", "미노출"]].map(([v, l]) => (
        <label key={v} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, cursor: "pointer" }}>
          <input type="radio" checked={val === v} onChange={() => onChange(v)} /> {l}
        </label>
      ))}
    </div>
  );

  return (
    <div>
      <PH title="로그인 안내메시지" bc="홈 > 환경설정 > 로그인 안내메시지" />
      <div>
        <div style={{ background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 12, padding: "28px 32px", maxWidth: 680 }}>
          <SecTitle label="안내 메시지 설정" primary />

          <FormRow label="노출 여부">
            <UseRadio val={form.useYn} onChange={v => sf("useYn", v)} />
            <div style={{ fontSize: 11, color: C.txS, marginTop: 5 }}>"노출" 설정 시 로그인 화면에 즉시 반영됩니다.</div>
          </FormRow>

          <FormRow label="안내 메시지 내용" required={form.useYn === "Y"}>
            <textarea
              value={form.content}
              onChange={e => { sf("content", e.target.value); setErrors(p => ({ ...p, content: "" })); }}
              placeholder={"로그인 화면에 표시할 안내 문구를 입력하세요.\n\n예) 본 시스템은 COMPLYSIGHT 정보시스템 자원 점검 관리 플랫폼입니다."}
              rows={8}
              maxLength={MAX_LEN}
              disabled={form.useYn === "N"}
              style={{ ...fInput, resize: "vertical", fontFamily: "inherit", lineHeight: 1.7, minHeight: 160, opacity: form.useYn === "N" ? 0.5 : 1 }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 3 }}>
              <div>{errors.content && <span style={{ fontSize: 11, color: "#ef4444" }}>{errors.content}</span>}</div>
              <span style={{ fontSize: 11, color: remaining < 50 ? "#ef4444" : C.txL }}>{form.content.length} / {MAX_LEN}자</span>
            </div>
          </FormRow>

          {/* 미리보기 */}
          {form.useYn === "Y" && form.content.trim() && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: C.txS, marginBottom: 8 }}>미리보기</div>
              <div style={{ padding: "14px 18px", borderRadius: 8, background: "#fffbeb", border: "1px solid #fde68a", fontSize: 13, color: "#92400e", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                {form.content}
              </div>
            </div>
          )}

          {saveOk && (
            <div style={{ padding: "10px 14px", borderRadius: 8, background: "#f0fdf4", border: "1px solid #bbf7d0", fontSize: 13, color: "#16a34a", marginBottom: 16 }}>
              ✓ 저장이 완료되었습니다.
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", paddingTop: 8, borderTop: `1px solid ${C.brd}` }}>
            <Btn primary onClick={handleSave}>저장</Btn>
          </div>
        </div>
      </div>
    </div>
  );
};


/* ── 공지배너 관리 ── */
const MgrBanner = ({ setBannerPreview }) => {
  const now = new Date("2026-02-23T10:00:00");
  const nowStr = now.toISOString().slice(0,16);

  const TYPE_ST = {
    "기본":  { bg: "#F2F3F5", txt: "#333333" },
    "강조":  { bg: "#1D6FD1", txt: "#fff" },
    "긴급":  { bg: "#D93025", txt: "#fff" },
  };
  const POSITIONS = ["전체 페이지","대시보드","점검현황","자원관리","공지사항"];

  const INIT = {
    title: "2월 정기점검 안내",
    msg: "2026년 2월 25일(수) 02:00~06:00 서버 정기점검이 진행됩니다.",
    type: "강조",
    pos: "전체 페이지",
    startDt: "2026-02-20T00:00",
    endDt: "2026-02-26T06:00",
    noEnd: false,
    immediate: false,
    linkUrl: "/notice/1",
    closable: true,
    closeMode: "하루 숨김",
  };

  const [form, setForm] = useState(INIT);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState(false);
  const [saveOk, setSaveOk] = useState(false);

  const sf = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const DEFAULT_BANNER_RESET = { title: "2월 정기점검 안내", msg: "2026년 2월 25일(수) 02:00~06:00 서버 정기점검이 진행됩니다.", type: "기본", bg: "#F2F3F5", txt: "#333333", linkUrl: "/notice/1", closable: true };

  /* 미리보기 on/off 시 상위 App에 배너 데이터 전달 */
  useEffect(() => {
    if (preview && setBannerPreview) {
      const curType = TYPE_ST[form.type] || TYPE_ST["기본"];
      setBannerPreview({ ...form, bg: curType.bg, txt: curType.txt });
    } else if (setBannerPreview) {
      setBannerPreview(DEFAULT_BANNER_RESET);
    }
  }, [preview, form.title, form.msg, form.type, form.linkUrl, form.closable]);

  /* 페이지 이탈 시 기본 배너로 복원 */
  useEffect(() => {
    return () => { if (setBannerPreview) setBannerPreview(DEFAULT_BANNER_RESET); };
  }, []);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "제목을 입력하세요.";
    if (!form.msg.trim()) e.msg = "배너 문구를 입력하세요.";
    if (!form.noEnd && form.endDt && form.startDt >= form.endDt) e.endDt = "종료일시는 시작일시 이후여야 합니다.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setSaveOk(true);
    setTimeout(() => setSaveOk(false), 2000);
  };

  const curType = TYPE_ST[form.type] || TYPE_ST["기본"];

  const Toggle2 = ({ on, onClick }) => (
    <div onClick={onClick} style={{ width:36, height:20, borderRadius:10, background:on?C.pri:"#EEEEEE", position:"relative", cursor:"pointer", flexShrink:0 }}>
      <div style={{ position:"absolute", top:2, left:on?18:2, width:16, height:16, borderRadius:"50%", background:"#fff", boxShadow:"0 1px 3px rgba(0,0,0,.2)", transition:"left .15s" }} />
    </div>
  );

  const inpSt = { ...fInput };
  const errTxt = { fontSize:11, color:"#ef4444", marginTop:3 };
  const BRow = ({ label, children, err, required }) => (
    <div style={{ marginBottom:16 }}>
      <label style={{ fontSize:12, fontWeight:600, color:C.txS, marginBottom:6, display:"flex", alignItems:"center", gap:3 }}>
        {label}{required && <span style={{ color:"#ef4444", fontSize:11 }}>*</span>}
      </label>
      {children}
      {err && <div style={errTxt}>{err}</div>}
    </div>
  );

  return (
    <div>
      <PH title="공지배너" bc="홈 > 환경설정 > 공지배너" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>

        {/* 왼쪽: 입력 폼 */}
        <div style={{ background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 12, padding: "28px 32px" }}>
          <SecTitle label="배너 설정" primary />

          {/* 기본 정보 */}
          <BRow label="배너 제목" required err={errors.title}>
            <input value={form.title} onChange={e => sf("title", e.target.value)} placeholder="배너 제목을 입력하세요" style={inpSt} />
          </BRow>
          <BRow label="배너 문구" required err={errors.msg}>
            <textarea value={form.msg} onChange={e => sf("msg", e.target.value)} placeholder="배너에 표시될 문구를 입력하세요" rows={2} style={{ ...inpSt, resize:"none", fontFamily:"inherit" }} />
          </BRow>
          <BRow label="링크 URL">
            <input value={form.linkUrl} onChange={e => sf("linkUrl", e.target.value)} placeholder="https:// (비워두면 링크 없음)" style={inpSt} />
          </BRow>

          <div style={{ borderTop: `1px solid ${C.brd}`, margin: "20px 0" }} />
          <SecTitle label="노출 설정" />

          <BRow label="노출 시작">
            <div style={{ display:"flex", gap:16, marginBottom:8 }}>
              {["즉시 노출","예약 노출"].map(opt => (
                <label key={opt} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, cursor:"pointer" }}>
                  <input type="radio" checked={form.immediate === (opt==="즉시 노출")} onChange={() => sf("immediate", opt==="즉시 노출")} /> {opt}
                </label>
              ))}
            </div>
            {!form.immediate
              ? <input type="datetime-local" value={form.startDt} onChange={e => sf("startDt", e.target.value)} style={{ ...inpSt, width:"auto" }} />
              : <div style={{ fontSize:11, color:C.pri }}>저장 즉시 노출됩니다.</div>
            }
          </BRow>
          <BRow label="노출 종료" err={errors.endDt}>
            <label style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, cursor:"pointer", marginBottom:8 }}>
              <input type="checkbox" checked={form.noEnd} onChange={e => sf("noEnd", e.target.checked)} /> 종료 없음 (무기한 노출)
            </label>
            {!form.noEnd && <input type="datetime-local" value={form.endDt} onChange={e => sf("endDt", e.target.value)} style={{ ...inpSt, width:"auto" }} />}
          </BRow>
          <BRow label="노출 위치">
            <select value={form.pos} onChange={e => sf("pos", e.target.value)} style={{ ...inpSt, cursor:"pointer", maxWidth: 220 }}>
              {POSITIONS.map(p => <option key={p}>{p}</option>)}
            </select>
          </BRow>

          <div style={{ borderTop: `1px solid ${C.brd}`, margin: "20px 0" }} />
          <SecTitle label="디자인 설정" />

          <BRow label="배너 타입">
            <div style={{ display:"flex", gap:8 }}>
              {["기본","강조","긴급"].map(tp => {
                const tpSt = TYPE_ST[tp];
                const sel = form.type === tp;
                return (
                  <div key={tp} onClick={() => sf("type", tp)}
                    style={{ flex:1, padding:"10px 0", textAlign:"center", borderRadius:8, fontSize:12, fontWeight:700,
                      border:`2px solid ${sel ? tpSt.bg : C.brd}`,
                      background: sel ? tpSt.bg : "#fff",
                      color: sel ? tpSt.txt : C.txS, cursor:"pointer",
                      transition:"all .15s" }}>
                    {tp}
                  </div>
                );
              })}
            </div>
          </BRow>
          <div style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 12px", background:"#f8fafc", borderRadius:7, border:`1px solid ${C.brd}`, marginBottom:16 }}>
            <Toggle2 on={form.closable} onClick={() => sf("closable", !form.closable)} />
            <span style={{ fontSize:12, fontWeight:600, color:C.txt }}>닫기 버튼 표시</span>
            {form.closable && (
              <select value={form.closeMode} onChange={e => sf("closeMode", e.target.value)}
                style={{ marginLeft:"auto", padding:"3px 8px", fontSize:11, border:`1px solid ${C.brd}`, borderRadius:5, outline:"none", background:"#fff", color:C.txt }}>
                <option>세션 숨김</option><option>하루 숨김</option>
              </select>
            )}
          </div>

          {saveOk && (
            <div style={{ padding:"10px 14px", borderRadius:8, background:"#f0fdf4", border:"1px solid #bbf7d0", fontSize:13, color:"#16a34a", marginBottom:12 }}>
              ✓ 배너가 저장되었습니다.
            </div>
          )}

          <div style={{ display:"flex", justifyContent:"space-between", paddingTop:12, borderTop:`1px solid ${C.brd}` }}>
            <button onClick={() => setPreview(p => !p)}
              style={{ padding:"7px 14px", fontSize:12, border:`1px solid ${C.brd}`, borderRadius:6,
                background: preview ? C.priL : "#fff", cursor:"pointer", color: preview ? C.pri : C.txS, fontWeight:600 }}>
              {preview ? "미리보기 숨김" : "미리보기"}
            </button>
            <Btn primary onClick={handleSave}>저장</Btn>
          </div>
        </div>

        {/* 오른쪽: 현재 설정 요약 */}
        <div style={{ background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 12, padding: "22px 22px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.txt, marginBottom: 16 }}>현재 배너 상태</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ padding:"3px 10px", borderRadius:12, fontSize:11, fontWeight:700, background: curType.bg, color: curType.txt }}>{form.type}</span>
            <span style={{ fontSize:13, fontWeight:600, color:C.txt }}>{form.title || "—"}</span>
          </div>
          {[
            ["노출 위치", form.pos],
            ["노출 시작", form.immediate ? "즉시" : form.startDt?.replace("T", " ") || "—"],
            ["노출 종료", form.noEnd ? "무기한" : form.endDt?.replace("T", " ") || "—"],
            ["닫기 버튼", form.closable ? `있음 (${form.closeMode})` : "없음"],
            ["링크", form.linkUrl || "없음"],
          ].map(([k, v]) => (
            <div key={k} style={{ display:"flex", gap:8, marginBottom:8, fontSize:12 }}>
              <span style={{ color:C.txS, minWidth:70, flexShrink:0 }}>{k}</span>
              <span style={{ color:C.txt, wordBreak:"break-all" }}>{v}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};



/* ── 기본알림 설정 ── */
const MgrAlert = () => {
  const [tab, setTab] = useState("send");
  const [saved, setSaved] = useState(false);

  /* ── 발송 설정 state ── */
  const [means, setMeans] = useState({ email: true, inapp: true });
  const [inspAlert, setInspAlert] = useState({
    beforeEnable: true, beforeValue: "1", beforeUnit: "일",
    delayEnable: true, specialEnable: true,
    batchFailEnable: true, scheduleChangeEnable: false,
  });
  const [receivers, setReceivers] = useState({ inspector: true, manager: true, orgAdmin: true });
  const [extraEmails, setExtraEmails] = useState([]);
  const [emailInput, setEmailInput] = useState("");

  /* ── 수신 설정 state ── */
  const [myAlert, setMyAlert] = useState({
    inspResult: true,        // 점검 결과 제출됨
    inspDelay: true,         // 점검 지연 (관리 대상 전체)
    specialCreated: true,    // 특별점검 생성
    scheduleChanged: true,   // 스케줄 변경
    resourceChanged: false,  // 자원 등록/수정
    userChanged: false,      // 사용자 등록/변경
    noticeNew: true,         // 공지사항 등록
    batchFail: true,         // 자동점검 배치 실패
  });
  const [myMeans, setMyMeans] = useState({ email: true, inapp: true });
  const [quietMode, setQuietMode] = useState(false);
  const [quietFrom, setQuietFrom] = useState("22:00");
  const [quietTo, setQuietTo] = useState("08:00");

  const setI = (key, val) => setInspAlert(p => ({ ...p, [key]: val }));
  const setR = (key, val) => setReceivers(p => ({ ...p, [key]: val }));
  const setM = (key, val) => setMeans(p => ({ ...p, [key]: val }));
  const setMA = (key, val) => setMyAlert(p => ({ ...p, [key]: val }));
  const setMM = (key, val) => setMyMeans(p => ({ ...p, [key]: val }));
  const addEmail = () => {
    const v = emailInput.trim();
    if (!v || extraEmails.includes(v)) return;
    setExtraEmails(p => [...p, v]);
    setEmailInput("");
  };
  const onSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const label14 = { fontSize: 13, fontWeight: 600, color: C.txt };
  const labelSub = { fontSize: 12, color: C.txS, marginTop: 2 };
  const timeOpts = ["00:00","06:00","07:00","08:00","09:00","18:00","20:00","21:00","22:00","23:00","23:59"];

  const Toggle = ({ on, onClick }) => (
    <div onClick={onClick} style={{ width: 40, height: 22, borderRadius: 11,
      background: on ? C.pri : "#EEEEEE", position: "relative", cursor: "pointer", flexShrink: 0 }}>
      <div style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 16, height: 16,
        borderRadius: "50%", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,.2)" }} />
    </div>
  );

  const Section = ({ title, desc, children }) => (
    <div style={{ background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 10, marginBottom: 20, overflow: "hidden" }}>
      <div style={{ padding: "13px 20px", borderBottom: `1px solid ${C.brd}`, background: "#f8fafc" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.txt }}>{title}</div>
        {desc && <div style={{ fontSize: 12, color: C.txS, marginTop: 2 }}>{desc}</div>}
      </div>
      <div style={{ padding: "4px 20px 12px" }}>{children}</div>
    </div>
  );

  const Row = ({ label, sub, right, last }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "11px 0", borderBottom: last ? "none" : "1px solid #f3f4f6" }}>
      <div>
        <div style={label14}>{label}</div>
        {sub && <div style={labelSub}>{sub}</div>}
      </div>
      <div style={{ flexShrink: 0, marginLeft: 16 }}>{right}</div>
    </div>
  );

  const tabs = [
    { k: "send", l: "발송 설정" },
    { k: "receive", l: "수신 설정" },
  ];

  return (
    <div>
      <PH title="기본알림" bc="홈 > 환경설정 > 기본알림" />
      <div style={{ maxWidth: 760 }}>

        {/* 탭 */}
        <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: `2px solid ${C.brd}` }}>
          {tabs.map(t => (
            <div key={t.k} onClick={() => setTab(t.k)}
              style={{ padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer",
                color: tab === t.k ? C.pri : C.txS,
                borderBottom: tab === t.k ? `2px solid ${C.pri}` : "2px solid transparent",
                marginBottom: -2 }}>
              {t.l}
            </div>
          ))}
        </div>

        {/* ── 발송 설정 탭 ── */}
        {tab === "send" && (
          <div>
            <Section title="알림 수단" desc="알림을 발송할 채널을 설정합니다.">
              <Row label="이메일 알림" sub="등록된 이메일 주소로 알림을 발송합니다."
                right={<Toggle on={means.email} onClick={() => setM("email", !means.email)} />} />
              <Row label="시스템 내 알림" sub="화면 상단 알림 아이콘으로 알림을 표시합니다." last
                right={<Toggle on={means.inapp} onClick={() => setM("inapp", !means.inapp)} />} />
            </Section>

            <Section title="점검 알림" desc="시스템에서 발송하는 점검 관련 알림을 설정합니다.">
              <div style={{ padding: "11px 0", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                  marginBottom: inspAlert.beforeEnable ? 10 : 0 }}>
                  <div>
                    <div style={label14}>점검 예정 알림</div>
                    <div style={labelSub}>점검 수행 전 미리 알림을 발송합니다.</div>
                  </div>
                  <Toggle on={inspAlert.beforeEnable} onClick={() => setI("beforeEnable", !inspAlert.beforeEnable)} />
                </div>
                {inspAlert.beforeEnable && (
                  <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
                    background: "#f8fafc", borderRadius: 7, border: `1px solid ${C.brd}` }}>
                    <span style={{ fontSize: 12, color: C.txS }}>점검</span>
                    <select value={inspAlert.beforeValue} onChange={e => setI("beforeValue", e.target.value)}
                      style={{ padding: "4px 8px", fontSize: 12, border: `1px solid ${C.brd}`, borderRadius: 5, background: "#fff", color: C.txt, outline: "none" }}>
                      {["1","2","3","5","7","14"].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <select value={inspAlert.beforeUnit} onChange={e => setI("beforeUnit", e.target.value)}
                      style={{ padding: "4px 8px", fontSize: 12, border: `1px solid ${C.brd}`, borderRadius: 5, background: "#fff", color: C.txt, outline: "none" }}>
                      {["시간","일"].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                    <span style={{ fontSize: 12, color: C.txS }}>전 발송</span>
                  </div>
                )}
              </div>
              <Row label="점검 지연 알림" sub="점검 기한이 초과되면 담당자에게 즉시 알림을 발송합니다."
                right={<Toggle on={inspAlert.delayEnable} onClick={() => setI("delayEnable", !inspAlert.delayEnable)} />} />
              <Row label="특별점검 배정 알림" sub="특별점검이 생성되어 담당자로 배정될 때 알림을 발송합니다."
                right={<Toggle on={inspAlert.specialEnable} onClick={() => setI("specialEnable", !inspAlert.specialEnable)} />} />
              <Row label="자동점검 배치 실패 알림" sub="정기점검 배치 수행 중 실패가 발생하면 관리자에게 알림을 발송합니다."
                right={<Toggle on={inspAlert.batchFailEnable} onClick={() => setI("batchFailEnable", !inspAlert.batchFailEnable)} />} />
              <Row label="스케줄 변경 알림" sub="정기점검 스케줄이 수정되면 관련 담당자에게 알림을 발송합니다." last
                right={<Toggle on={inspAlert.scheduleChangeEnable} onClick={() => setI("scheduleChangeEnable", !inspAlert.scheduleChangeEnable)} />} />
            </Section>

            <Section title="수신 대상" desc="알림을 받을 역할을 설정합니다.">
              <Row label="점검자" sub="해당 자원의 점검 담당자에게 발송합니다."
                right={<Toggle on={receivers.inspector} onClick={() => setR("inspector", !receivers.inspector)} />} />
              <Row label="관리자 (유지보수 총괄)" sub="소속 정보시스템의 관리자에게 발송합니다."
                right={<Toggle on={receivers.manager} onClick={() => setR("manager", !receivers.manager)} />} />
              <Row label="기관 관리자" sub="기관 관리자에게도 동일한 알림을 발송합니다." last
                right={<Toggle on={receivers.orgAdmin} onClick={() => setR("orgAdmin", !receivers.orgAdmin)} />} />
            </Section>
          </div>
        )}

        {/* ── 수신 설정 탭 ── */}
        {tab === "receive" && (
          <div>
            <Section title="수신 채널" desc="알림을 받을 채널을 설정합니다.">
              <Row label="이메일로 받기" sub="알림을 이메일로 수신합니다."
                right={<Toggle on={myMeans.email} onClick={() => setMM("email", !myMeans.email)} />} />
              <Row label="시스템 내 알림으로 받기" sub="화면 상단 알림 아이콘으로 수신합니다." last
                right={<Toggle on={myMeans.inapp} onClick={() => setMM("inapp", !myMeans.inapp)} />} />
            </Section>

            <Section title="점검 관리 알림" desc="관리 중인 정보시스템의 점검 현황 관련 알림을 설정합니다.">
              <Row label="점검 결과 제출 알림" sub="담당 정보시스템의 점검 결과가 제출될 때 알림을 받습니다."
                right={<Toggle on={myAlert.inspResult} onClick={() => setMA("inspResult", !myAlert.inspResult)} />} />
              <Row label="점검 지연 알림" sub="담당 정보시스템 내 점검이 기한을 초과하면 알림을 받습니다."
                right={<Toggle on={myAlert.inspDelay} onClick={() => setMA("inspDelay", !myAlert.inspDelay)} />} />
              <Row label="특별점검 생성 알림" sub="담당 정보시스템에 특별점검이 생성될 때 알림을 받습니다."
                right={<Toggle on={myAlert.specialCreated} onClick={() => setMA("specialCreated", !myAlert.specialCreated)} />} />
              <Row label="정기점검 스케줄 변경 알림" sub="담당 정보시스템의 점검 스케줄이 변경될 때 알림을 받습니다." last
                right={<Toggle on={myAlert.scheduleChanged} onClick={() => setMA("scheduleChanged", !myAlert.scheduleChanged)} />} />
            </Section>

            <Section title="자원 및 사용자 관리 알림" desc="자원과 사용자 변경 관련 알림을 설정합니다.">
              <Row label="자원 등록/수정 알림" sub="담당 정보시스템에 자원이 등록되거나 수정될 때 알림을 받습니다."
                right={<Toggle on={myAlert.resourceChanged} onClick={() => setMA("resourceChanged", !myAlert.resourceChanged)} />} />
              <Row label="사용자 등록/변경 알림" sub="사용자 계정이 등록되거나 권한이 변경될 때 알림을 받습니다." last
                right={<Toggle on={myAlert.userChanged} onClick={() => setMA("userChanged", !myAlert.userChanged)} />} />
            </Section>

            <Section title="시스템 운영 알림" desc="시스템 운영 관련 알림을 설정합니다.">
              <Row label="자동점검 배치 실패 알림" sub="정기점검 배치 수행 중 실패가 발생할 때 알림을 받습니다."
                right={<Toggle on={myAlert.batchFail} onClick={() => setMA("batchFail", !myAlert.batchFail)} />} />
              <Row label="공지사항 등록 알림" sub="새 공지사항이 등록될 때 알림을 받습니다." last
                right={<Toggle on={myAlert.noticeNew} onClick={() => setMA("noticeNew", !myAlert.noticeNew)} />} />
            </Section>

            <Section title="방해 금지 시간대" desc="설정한 시간대에는 알림을 받지 않습니다.">
              <Row label="방해 금지 모드" sub="지정된 시간대에는 알림 발송을 차단합니다."
                right={<Toggle on={quietMode} onClick={() => setQuietMode(!quietMode)} />} />
              {quietMode && (
                <div style={{ padding: "10px 12px", background: "#f8fafc", borderRadius: 8,
                  border: `1px solid ${C.brd}`, display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                  <span style={{ fontSize: 12, color: C.txS, minWidth: 28 }}>시작</span>
                  <select value={quietFrom} onChange={e => setQuietFrom(e.target.value)}
                    style={{ padding: "4px 8px", fontSize: 12, border: `1px solid ${C.brd}`, borderRadius: 5, background: "#fff", color: C.txt, outline: "none" }}>
                    {timeOpts.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <span style={{ fontSize: 12, color: C.txS }}>~</span>
                  <span style={{ fontSize: 12, color: C.txS, minWidth: 28 }}>종료</span>
                  <select value={quietTo} onChange={e => setQuietTo(e.target.value)}
                    style={{ padding: "4px 8px", fontSize: 12, border: `1px solid ${C.brd}`, borderRadius: 5, background: "#fff", color: C.txt, outline: "none" }}>
                    {timeOpts.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              )}
            </Section>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12 }}>
          {saved && <span style={{ fontSize: 13, color: "#22c55e", fontWeight: 600 }}>&#10003; 저장되었습니다.</span>}
          <button onClick={onSave} style={{ padding: "9px 28px", background: C.pri, color: "#fff",
            border: "none", borderRadius: 7, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            저장
          </button>
        </div>

      </div>
    </div>
  );
};

/* ── 휴무일 설정 ── */
const MgrHoliday = () => {
  const today = new Date(2026, 1, 1);
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [showYMPicker, setShowYMPicker] = useState(false);
  const [pickerYear, setPickerYear] = useState(today.getFullYear());
  const [panelOpen, setPanelOpen] = useState(false);
  const [validMsg, setValidMsg] = useState("");
  const [selectedHol, setSelectedHol] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type, id }
  const [saveConfirm, setSaveConfirm] = useState(null);     // { type, id }

  const [publicHolUse, setPublicHolUse] = useState("사용");
  const [regularHols, setRegularHols] = useState([]);
  const [tempHols, setTempHols] = useState([]);

  const publicHols = {
    "2026-01-28": "설날", "2026-01-29": "설날", "2026-01-30": "설날",
    "2026-03-01": "삼일절", "2026-05-05": "어린이날",
  };

  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const prevDays = new Date(viewYear, viewMonth, 0).getDate();
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const pad = n => String(n).padStart(2, "0");
  const toDateStr = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;

  const getHolLabels = (dateStr, dayOfWeek) => {
    const labels = [];
    if (publicHolUse === "사용" && publicHols[dateStr]) labels.push({ t: publicHols[dateStr], c: "#929292", type: "pub" });
    const regMatches = regularHols.filter(r => {
      if (r.createdAt && dateStr < r.createdAt) return false;
      if (r.freq === "매일") return true;
      if (r.freq === "매주") { const dayMap = { "일": 0, "월": 1, "화": 2, "수": 3, "목": 4, "금": 5, "토": 6 }; return r.day && dayMap[r.day] === dayOfWeek; }
      if (r.freq === "매월") { const d = parseInt(r.date); return !isNaN(d) && d === new Date(dateStr).getDate(); }
      return false;
    });
    regMatches.forEach(r => labels.push({ t: r.nm || "정기 휴무", c: C.pri, type: "reg", matches: [r] }));
    const tmpMatches = tempHols.filter(t => {
      if (t.createdAt && dateStr < t.createdAt) return false;
      return t.from && t.to && dateStr >= t.from && dateStr <= t.to;
    });
    tmpMatches.forEach(t => labels.push({ t: t.nm || "임시 휴무", c: "#f59e0b", type: "tmp", matches: [t] }));
    return labels;
  };

  const weeks = ["일", "월", "화", "수", "목", "금", "토"];
  const freqOpts = ["매일", "매주", "매월"];
  const dayOpts = ["월", "화", "수", "목", "금", "토", "일"];
  const timeOpts = ["00:00", "06:00", "08:00", "09:00", "12:00", "18:00", "22:00", "23:59"];
  const dateOpts = Array.from({ length: 31 }, (_, i) => String(i + 1) + "일");

  const todayStr = `${today.getFullYear()}-${pad(today.getMonth()+1)}-${pad(today.getDate())}`;
  const addRegular = () => setRegularHols(prev => [...prev, { id: Date.now(), nm: "", freq: "매일", weekDays: [], monthDays: [], day: "", date: "", time: "", createdAt: todayStr }]);
  const removeRegular = (id) => setRegularHols(prev => prev.filter(r => r.id !== id));
  const updateRegular = (id, key, val) => setRegularHols(prev => prev.map(r => {
    if (r.id !== id) return r;
    if (key === "freq") return { ...r, freq: val, day: "", date: "", time: "" };
    return { ...r, [key]: val };
  }));
  const addTemp = () => setTempHols(prev => [...prev, { id: Date.now(), nm: "", from: "", to: "", createdAt: todayStr }]);
  const removeTemp = (id) => setTempHols(prev => prev.filter(t => t.id !== id));
  const updateTemp = (id, key, val) => setTempHols(prev => prev.map(t => t.id === id ? { ...t, [key]: val } : t));

  const selSt = { padding: "5px 8px", fontSize: 12, border: `1px solid ${C.brd}`, borderRadius: 5, background: "#fff", color: C.txt, cursor: "pointer", outline: "none" };
  const inpSt = { padding: "5px 8px", fontSize: 12, border: `1px solid ${C.brd}`, borderRadius: 5, background: "#fff", color: C.txt, outline: "none", width: 130 };
  const [openSec, setOpenSec] = useState({ pub: true, reg: true, tmp: true });
  const togSec = k => setOpenSec(p => ({ ...p, [k]: !p[k] }));

  return (
    <div>
      <PH title="휴무일설정" bc="홈 > 환경설정 > 휴무일설정" />

      {/* 달력 카드 */}
      <div style={{ background: C.white, borderRadius: 8, border: `1px solid ${C.brd}`, overflow: "hidden", display: "flex", flexDirection: "column", height: "calc(98vh - 170px)", maxHeight: 1500 }}>
        {/* 달력 네비 + 우측 버튼 */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 12px", borderBottom: `1px solid ${C.brd}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, position: "relative" }}>
            <span onClick={() => { setPickerYear(viewYear); setShowYMPicker(!showYMPicker); }}
              style={{ fontSize: 28, fontWeight: 700, color: C.txH, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, userSelect: "none", padding: "2px 0", transition: "opacity .2s" }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.7"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}>
              {viewYear}.{viewMonth + 1}
              <svg width="14" height="14" viewBox="0 0 12 12" fill="none" style={{ marginTop: 2 }}><path d="M3 4.5L6 7.5L9 4.5" stroke={C.txL} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>

            {showYMPicker && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 98 }} onClick={() => setShowYMPicker(false)} />
                <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 99,
                  background: "#fff", borderRadius: 10, boxShadow: "0 4px 24px rgba(0,0,0,.14)",
                  border: `1px solid ${C.brd}`, padding: "14px 16px", minWidth: 260 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                    <span onClick={() => setPickerYear(pickerYear - 1)} style={{ cursor: "pointer", padding: "2px 10px", fontWeight: 700, fontSize: 14, color: C.txS, userSelect: "none" }}>‹</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: C.txt }}>{pickerYear}년</span>
                    <span onClick={() => setPickerYear(pickerYear + 1)} style={{ cursor: "pointer", padding: "2px 10px", fontWeight: 700, fontSize: 14, color: C.txS, userSelect: "none" }}>›</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 6 }}>
                    {Array.from({ length: 12 }, (_, i) => {
                      const isSelected = pickerYear === viewYear && i === viewMonth;
                      return (
                        <div key={i} onClick={() => { setViewYear(pickerYear); setViewMonth(i); setShowYMPicker(false); }}
                          style={{ textAlign: "center", padding: "7px 0", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer",
                            background: isSelected ? C.pri : "transparent", color: isSelected ? "#fff" : C.txt,
                            border: isSelected ? `1px solid ${C.pri}` : `1px solid ${C.brd}` }}
                          onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = C.priL; }}
                          onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = "transparent"; }}>
                          {pad(i + 1)}월
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* 범례 */}
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              {[{ c: "#929292", l: "공휴일" }, { c: C.pri, l: "정기" }, { c: "#f59e0b", l: "임시" }].map(lg =>
                <span key={lg.l} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: C.txS }}>
                  <span style={{ width: 8, height: 8, borderRadius: 2, background: lg.c }} />{lg.l}
                </span>
              )}
            </div>
            <Btn primary onClick={() => { setSelectedHol(null); setPanelOpen(true); }}>+ 휴무일 관리</Btn>
          </div>
        </div>

        {/* 요일 헤더 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", flexShrink: 0 }}>
          {weeks.map((w, i) => (
            <div key={w} style={{ padding: "10px 12px", fontSize: 11, fontWeight: 600, letterSpacing: "0.06em",
              color: i === 0 ? "#ef4444" : i === 6 ? C.pri : C.txL, borderBottom: `1px solid ${C.brd}` }}>
              {w}
            </div>
          ))}
        </div>

        {/* 날짜 셀 */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridTemplateRows: `repeat(${Math.ceil((firstDay + daysInMonth) / 7)}, 1fr)`, flex: 1, minHeight: 0 }}>
          {Array.from({ length: totalCells }, (_, idx) => {
            const dayNum = idx - firstDay + 1;
            const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
            const displayDay = isCurrentMonth ? dayNum : (dayNum <= 0 ? prevDays + dayNum : dayNum - daysInMonth);
            const dateStr = isCurrentMonth ? toDateStr(viewYear, viewMonth, dayNum) : null;
            const dayOfWeek = idx % 7;
            const holLabels = isCurrentMonth ? getHolLabels(dateStr, dayOfWeek) : [];
            const isWeekRow = Math.floor(idx / 7);
            const isLastRow = isWeekRow === Math.ceil(totalCells / 7) - 1;
            return (
              <div key={idx} style={{
                position: "relative", padding: "8px 12px",
                borderBottom: isLastRow ? "none" : `1px solid ${C.brd}`,
                borderRight: dayOfWeek < 6 ? `1px solid ${C.brd}` : "none",
                background: "transparent",
              }}>
                <div style={{
                  fontSize: 22, fontWeight: 700, lineHeight: 1, marginBottom: 6,
                  color: !isCurrentMonth ? C.txX : dayOfWeek === 0 ? "#ef4444" : dayOfWeek === 6 ? C.pri : C.txH,
                }}>{pad(displayDay)}</div>
                {holLabels.map((hl, hi) => (
                  <div key={hi} onClick={() => {
                    if (hl.type === "reg" || hl.type === "tmp") {
                      setSelectedHol({ type: hl.type, dateStr, matches: hl.matches });
                      setPanelOpen(true);
                    }
                  }} style={{
                    fontSize: 11, fontWeight: 500,
                    background: hl.c + "28",
                    color: hl.c.replace("99", ""),
                    padding: "2px 7px",
                    marginBottom: 2, borderRadius: 3,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                    cursor: (hl.type === "reg" || hl.type === "tmp") ? "pointer" : "default",
                  }}>{hl.t}</div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── SidePanel: 휴무일 설정 ── */}
      <SidePanel open={panelOpen} onClose={() => { setPanelOpen(false); setSelectedHol(null); setValidMsg(""); }} title={selectedHol ? (selectedHol.type === "reg" ? "정기 휴무 상세" : "임시 휴무 상세") : "휴무일 설정"} width={480}>
        <div style={{ display: "flex", flexDirection: "column", gap: 0, height: "100%" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: "4px 0 24px" }}>
          {selectedHol ? (
            /* ── 선택된 휴무 상세/수정 뷰 ── */
            <div>
              {selectedHol.type === "reg" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ fontSize: 12, color: C.txS, marginBottom: 4 }}>
                    선택일: <strong style={{ color: C.txt }}>{selectedHol.dateStr}</strong>에 적용되는 정기 휴무
                  </div>
                  {selectedHol.matches.map((snap, i) => {
                    const r = regularHols.find(x => x.id === snap.id) || snap;
                    const dayOn  = r.freq === "매주";
                    const dateOn = r.freq === "매월";
                    const timeOn = r.freq === "매주" || r.freq === "매월";
                    const disabledSt = { padding: "5px 8px", fontSize: 12, border: `1px solid ${C.brd}`, borderRadius: 5, background: "#F9FAFC", color: C.txL, cursor: "not-allowed", pointerEvents: "none" };
                    const selStL = { padding: "5px 8px", fontSize: 12, border: `1px solid ${C.brd}`, borderRadius: 5, background: "#fff", color: C.txt, cursor: "pointer", outline: "none" };
                    const inpStL = { padding: "5px 8px", fontSize: 12, border: `1px solid ${C.brd}`, borderRadius: 5, background: "#fff", color: C.txt, outline: "none", width: 200 };
                    return (
                      <div key={r.id} style={{ padding: "14px 16px", border: `1px solid ${C.brd}`, borderRadius: 8, display: "flex", flexDirection: "column", gap: 10 }}>
                        {/* 타이틀 + 삭제 버튼 */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: C.txt }}>{r.nm || `정기 휴무 ${i + 1}`}</div>
                          <span onClick={() => setDeleteConfirm({ type: "reg", id: r.id })}
                            style={{ fontSize: 12, color: "#ef4444", cursor: "pointer", fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: "#fef2f2" }}>삭제</span>
                        </div>
                        <div style={{ borderBottom: `1px solid ${C.brd}`, margin: "2px 0 4px" }} />
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 12, color: C.txS, minWidth: 64 }}>휴무 명</span>
                          <input value={r.nm} onChange={e => updateRegular(r.id, "nm", e.target.value)} placeholder="정기 휴무 명" style={inpStL} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 12, color: C.txS, minWidth: 64 }}>주기</span>
                          <select value={r.freq} onChange={e => updateRegular(r.id, "freq", e.target.value)} style={selStL}>
                            {["매일","매주","매월"].map(o => <option key={o}>{o}</option>)}
                          </select>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 12, color: C.txS, minWidth: 64 }}>요일</span>
                          <select value={r.day} onChange={e => updateRegular(r.id, "day", e.target.value)} disabled={!dayOn} style={dayOn ? selStL : disabledSt}>
                            <option value="">요일</option>
                            {["월","화","수","목","금","토","일"].map(o => <option key={o}>{o}</option>)}
                          </select>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 12, color: C.txS, minWidth: 64 }}>날짜</span>
                          <select value={r.date} onChange={e => updateRegular(r.id, "date", e.target.value)} disabled={!dateOn} style={dateOn ? selStL : disabledSt}>
                            <option value="">날짜</option>
                            {Array.from({ length: 31 }, (_, i) => String(i + 1) + "일").map(o => <option key={o}>{o}</option>)}
                          </select>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span style={{ fontSize: 12, color: C.txS, minWidth: 64 }}>시간</span>
                          <select value={r.time} onChange={e => updateRegular(r.id, "time", e.target.value)} disabled={!timeOn} style={timeOn ? selStL : disabledSt}>
                            <option value="">시간</option>
                            {["00:00","06:00","08:00","09:00","12:00","18:00","22:00","23:59"].map(o => <option key={o}>{o}</option>)}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {selectedHol.type === "tmp" && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ fontSize: 12, color: C.txS, marginBottom: 4 }}>
                    선택일: <strong style={{ color: C.txt }}>{selectedHol.dateStr}</strong>에 적용되는 임시 휴무
                  </div>
                  {selectedHol.matches.map((snap, i) => {
                    const t = tempHols.find(x => x.id === snap.id) || snap;
                    const inpSt2 = { padding: "5px 8px", fontSize: 12, border: `1px solid ${C.brd}`, borderRadius: 5, background: "#fff", color: C.txt, outline: "none" };
                    return (
                    <div key={t.id} style={{ padding: "14px 16px", border: `1px solid ${C.brd}`, borderRadius: 8, display: "flex", flexDirection: "column", gap: 10 }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.txt }}>{t.nm || `임시 휴무 ${i + 1}`}</div>
                        <span onClick={() => setDeleteConfirm({ type: "tmp", id: t.id })}
                          style={{ fontSize: 12, color: "#ef4444", cursor: "pointer", fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: "#fef2f2" }}>삭제</span>
                      </div>
                      <div style={{ borderBottom: `1px solid ${C.brd}`, margin: "2px 0 4px" }} />
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, color: C.txS, minWidth: 64 }}>휴무 명</span>
                        <input value={t.nm} onChange={e => updateTemp(t.id, "nm", e.target.value)} placeholder="임시 휴무 명" style={{ ...inpSt2, width: 200 }} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ fontSize: 12, color: C.txS, minWidth: 64 }}>기간</span>
                        <input type="date" value={t.from} onChange={e => updateTemp(t.id, "from", e.target.value)} style={{ ...inpSt2, width: 130 }} />
                        <span style={{ fontSize: 12, color: C.txS }}>~</span>
                        <input type="date" value={t.to} onChange={e => updateTemp(t.id, "to", e.target.value)} style={{ ...inpSt2, width: 130 }} />
                      </div>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* ── 휴무일 설정 전체 뷰 ── */
            <div>
            {/* 공휴일 섹션 */}
            <div style={{ marginBottom: 24 }}>
              <div onClick={() => togSec("pub")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", marginBottom: openSec.pub ? 12 : 0, userSelect: "none" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.txt }}>공휴일</span>
                <span style={{ fontSize: 11, color: C.txL }}>{openSec.pub ? "∧" : "∨"}</span>
              </div>
              {openSec.pub && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 2 }}>
                  <span style={{ fontSize: 12, color: C.txS, minWidth: 60 }}>공휴일 휴무</span>
                  <div style={{ display: "flex", gap: 0, border: `1px solid ${C.brd}`, borderRadius: 6, overflow: "hidden" }}>
                    {["사용", "미사용"].map(v => (
                      <button key={v} onClick={() => setPublicHolUse(v)}
                        style={{ padding: "6px 20px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                          border: "none", borderRight: v === "사용" ? `1px solid ${C.brd}` : "none",
                          background: publicHolUse === v ? C.pri : "#F9FAFC",
                          color: publicHolUse === v ? "#fff" : C.txS }}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div style={{ borderTop: `1px solid ${C.brd}`, marginBottom: 24 }} />

            {/* 정기휴무 섹션 */}
            <div style={{ marginBottom: 24 }}>
              <div onClick={() => togSec("reg")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", marginBottom: openSec.reg ? 14 : 0, userSelect: "none" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.txt }}>정기휴무</span>
                <span style={{ fontSize: 11, color: C.txL }}>{openSec.reg ? "∧" : "∨"}</span>
              </div>
              {openSec.reg && (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {regularHols.map((r, i) => {
                    const dayNms = ["월","화","수","목","금","토","일"];

                    const toggleRegDay = (dayIdx) => {
                      const cur = r.weekDays || [];
                      const next = cur.includes(dayIdx) ? cur.filter(x => x !== dayIdx) : [...cur, dayIdx].sort((a,b)=>a-b);
                      updateRegular(r.id, "weekDays", next);
                    };
                    const toggleRegDate = (d) => {
                      const cur = r.monthDays || [];
                      const next = cur.includes(d) ? cur.filter(x => x !== d) : [...cur, d].sort((a,b)=>a-b);
                      updateRegular(r.id, "monthDays", next);
                    };

                    // 인터벌 값 (interval 필드 없으면 기본 1)
                    const interval = r.interval || 1;
                    const setInterval = (v) => updateRegular(r.id, "interval", v);

                    // 요약 문구 — 정기점검 반복설정과 동일 로직
                    let summary = "";
                    if (r.freq === "매일") {
                      summary = interval === 1 ? "매일 발생" : `${interval}일마다 발생`;
                    } else if (r.freq === "매주") {
                      const wds = (r.weekDays || []).map(idx => dayNms[idx]).join(", ");
                      const prefix = interval === 1 ? "매주" : `${interval}주마다`;
                      summary = wds ? `${prefix} ${wds}요일에 발생` : `${prefix} 발생 (요일 미선택)`;
                    } else if (r.freq === "매월") {
                      const prefix = interval === 1 ? "매월" : `${interval}개월마다`;
                      const ds = r.monthDays || [];
                      summary = ds.length === 0
                        ? `${prefix} 발생 (날짜 미선택)`
                        : `${prefix} ${ds.map(d => d + "일").join(", ")}에 발생`;
                    }

                    return (
                      <div key={r.id} style={{ border: `1px solid ${C.brd}`, borderRadius: 8, padding: "14px 16px", background: "#FAFCFF" }}>

                        {/* 헤더: 이름 + 제거 */}
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                          <input
                            value={r.nm}
                            onChange={e => updateRegular(r.id, "nm", e.target.value)}
                            placeholder="정기 휴무 명"
                            style={{ ...inpSt, flex: 1 }}
                          />
                          <span onClick={() => removeRegular(r.id)} style={{ cursor: "pointer", color: "#ef4444", fontSize: 12, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: "#fef2f2", flexShrink: 0 }}>제거</span>
                        </div>

                        {/* ─── 반복 간격 (정기점검 반복설정과 동일 구조) ─── */}
                        <div>
                          <label style={{ fontSize: 12, fontWeight: 600, color: C.txS, display: "block", marginBottom: 6 }}>반복 간격</label>

                          {/* 1행: 숫자 select + 단위 select */}
                          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: r.freq !== "매일" ? 10 : 4 }}>
                            <select
                              value={interval}
                              onChange={e => setInterval(+e.target.value)}
                              style={{ padding: "6px 10px", fontSize: 13, border: `1px solid ${C.brd}`, borderRadius: 6, background: "#fff", color: C.txt, cursor: "pointer", outline: "none", minWidth: 60 }}>
                              {Array.from({ length: 30 }, (_, j) => j + 1).map(n => <option key={n} value={n}>{n}</option>)}
                            </select>
                            <select
                              value={r.freq}
                              onChange={e => updateRegular(r.id, "freq", e.target.value)}
                              style={{ padding: "6px 10px", fontSize: 13, border: `1px solid ${C.brd}`, borderRadius: 6, background: "#fff", color: C.txt, cursor: "pointer", outline: "none", minWidth: 60 }}>
                              <option value="매일">일</option>
                              <option value="매주">주</option>
                              <option value="매월">월</option>
                            </select>
                          </div>

                          {/* 2행: 주 — 요일 원형 토글 */}
                          {r.freq === "매주" && (
                            <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                              {dayNms.map((d, idx) => {
                                const active = (r.weekDays || []).includes(idx);
                                return (
                                  <span key={d} onClick={() => toggleRegDay(idx)} style={{
                                    width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 12, fontWeight: active ? 700 : 400, cursor: "pointer",
                                    border: `1.5px solid ${active ? C.pri : C.brd}`,
                                    background: active ? C.pri : "#fff",
                                    color: active ? "#fff" : C.txS,
                                    transition: "all .3s", userSelect: "none"
                                  }}>{d}</span>
                                );
                              })}
                            </div>
                          )}

                          {/* 2행: 월 — 날짜 다중 선택 그리드 */}
                          {r.freq === "매월" && (() => {
                            const days = r.monthDays || [];
                            return (
                              <div style={{ marginBottom: 10 }}>
                                <div style={{ fontSize: 11, color: C.txL, marginBottom: 6 }}>휴무 날짜를 선택하세요 (복수 선택 가능)</div>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 34px)", gap: 4 }}>
                                  {Array.from({ length: 31 }, (_, j) => j + 1).map(d => {
                                    const active = days.includes(d);
                                    return (
                                      <span key={d} onClick={() => toggleRegDate(d)} style={{
                                        width: 34, height: 34, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 12, fontWeight: active ? 700 : 400, cursor: "pointer",
                                        border: `1.5px solid ${active ? C.pri : C.brd}`,
                                        background: active ? C.pri : "#fff",
                                        color: active ? "#fff" : C.txS,
                                        transition: "all .3s", userSelect: "none"
                                      }}>{d}</span>
                                    );
                                  })}
                                </div>
                                {days.length > 0 && (
                                  <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 4 }}>
                                    {days.map(d => (
                                      <span key={d} style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "2px 8px", borderRadius: 10, background: C.priL, color: C.priD, fontSize: 11, fontWeight: 600 }}>
                                        {d}일 <span onClick={() => toggleRegDate(d)} style={{ cursor: "pointer", fontSize: 12, lineHeight: 1 }}>×</span>
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })()}

                          {/* 요약 문구 — 정기점검 반복설정과 동일 스타일 */}
                          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", borderRadius: 8,
                            background: "#F0F5FF", border: `1px solid ${C.priL}`, marginTop: 4 }}>
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                              <path d="M7 1.5A5.5 5.5 0 1 0 7 12.5 5.5 5.5 0 0 0 7 1.5zm.5 8H6.5V6.5h1V9.5zm0-4H6.5v-1h1v1z" fill={C.pri}/>
                            </svg>
                            <span style={{ fontSize: 12, color: C.pri, fontWeight: 600 }}>{summary}</span>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                  <div onClick={addRegular} style={{ fontSize: 12, color: C.pri, cursor: "pointer", fontWeight: 600, marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> 정기 휴무일 추가
                  </div>
                </div>
              )}
            </div>

            <div style={{ borderTop: `1px solid ${C.brd}`, marginBottom: 24 }} />

            {/* 임시 휴무 섹션 */}
            <div style={{ marginBottom: 8 }}>
              <div onClick={() => togSec("tmp")} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", marginBottom: openSec.tmp ? 14 : 0, userSelect: "none" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: C.txt }}>임시 휴무일</span>
                <span style={{ fontSize: 11, color: C.txL }}>{openSec.tmp ? "∧" : "∨"}</span>
              </div>
              {openSec.tmp && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {tempHols.map((t) => (
                    <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        value={t.nm}
                        onChange={e => updateTemp(t.id, "nm", e.target.value)}
                        placeholder="임시 휴무 명"
                        style={{ ...inpSt, width: 110, flexShrink: 0 }}
                      />
                      <input type="date" value={t.from} onChange={e => updateTemp(t.id, "from", e.target.value)} style={inpSt} />
                      <span style={{ fontSize: 12, color: C.txS }}>~</span>
                      <input type="date" value={t.to} onChange={e => updateTemp(t.id, "to", e.target.value)} style={inpSt} />
                      <span onClick={() => removeTemp(t.id)} style={{ cursor: "pointer", color: "#ef4444", fontSize: 12, fontWeight: 600, padding: "3px 6px", borderRadius: 4, background: "#fef2f2" }}>제거</span>
                    </div>
                  ))}
                  <div onClick={addTemp} style={{ fontSize: 12, color: C.pri, cursor: "pointer", fontWeight: 600, paddingLeft: 32, marginTop: 2 }}>
                    +임시 휴무일 추가
                  </div>
                </div>
              )}
            </div>
            </div>
          )}
          </div>

          {/* 하단 버튼 */}
          <div style={{ borderTop: `1px solid ${C.brd}`, paddingTop: 16, display: "flex", justifyContent: "flex-end", gap: 8, flexShrink: 0 }}>
            <Btn onClick={() => { setPanelOpen(false); setSelectedHol(null); setValidMsg(""); }}>취소</Btn>
            {selectedHol ? (
              /* 상세 뷰: 저장 버튼 → 반영 범위 알럿 */
              <Btn primary onClick={() => setSaveConfirm({ type: selectedHol.type })}>저장</Btn>
            ) : (
              /* 설정 뷰: 등록 버튼 → 유효성 검사 */
              <Btn primary onClick={() => {
                const missing = [];
                regularHols.forEach((r, i) => {
                  const label = r.nm ? `"${r.nm}"` : `정기 휴무 ${i + 1}번`;
                  if (!r.nm) missing.push(`${label}: 정기 휴무 명 필수 입력`);
                  if (r.freq === "매주" && !r.day) missing.push(`${label}: 요일 필수 선택`);
                  if (r.freq === "매월" && !r.date) missing.push(`${label}: 날짜 필수 선택`);
                });
                if (missing.length > 0) { setValidMsg(missing.join("\n")); return; }
                setValidMsg("");
                setPanelOpen(false);
              }}>등록</Btn>
            )}
          </div>

          {/* 유효성 팝업 */}
          {validMsg && (
            <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.35)" }} onClick={() => setValidMsg("")} />
              <div style={{ position: "relative", background: "#fff", borderRadius: 10, padding: "28px 28px 20px", minWidth: 320, maxWidth: 420, boxShadow: "0 8px 32px rgba(0,0,0,.18)", zIndex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.txt, marginBottom: 14 }}>필수 항목을 입력해 주세요</div>
                <div style={{ fontSize: 13, color: C.txS, lineHeight: 2, whiteSpace: "pre-line", marginBottom: 20 }}>{validMsg}</div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Btn primary onClick={() => setValidMsg("")}>확인</Btn>
                </div>
              </div>
            </div>
          )}

          {/* 삭제 확인 알럿 */}
          {deleteConfirm && (
            <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.35)" }} onClick={() => setDeleteConfirm(null)} />
              <div style={{ position: "relative", background: "#fff", borderRadius: 10, padding: "28px 28px 20px", minWidth: 300, maxWidth: 380, boxShadow: "0 8px 32px rgba(0,0,0,.18)", zIndex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.txt, marginBottom: 10 }}>휴무 삭제</div>
                <div style={{ fontSize: 13, color: C.txS, marginBottom: 24, lineHeight: 1.7 }}>해당 휴무를 삭제하시겠습니까?<br/>삭제된 휴무는 복구할 수 없습니다.</div>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                  <Btn onClick={() => setDeleteConfirm(null)}>취소</Btn>
                  <Btn primary onClick={() => {
                    if (deleteConfirm.type === "reg") removeRegular(deleteConfirm.id);
                    else removeTemp(deleteConfirm.id);
                    setDeleteConfirm(null);
                    setPanelOpen(false);
                    setSelectedHol(null);
                  }} style={{ background: "#ef4444", borderColor: "#ef4444" }}>삭제</Btn>
                </div>
              </div>
            </div>
          )}

          {/* 저장 범위 알럿 */}
          {saveConfirm && (
            <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.35)" }} onClick={() => setSaveConfirm(null)} />
              <div style={{ position: "relative", background: "#fff", borderRadius: 10, padding: "28px 28px 20px", minWidth: 320, maxWidth: 400, boxShadow: "0 8px 32px rgba(0,0,0,.18)", zIndex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.txt, marginBottom: 8 }}>변경 내용 반영 범위</div>
                <div style={{ fontSize: 12, color: C.txS, marginBottom: 20, lineHeight: 1.7 }}>수정된 휴무 설정을 어느 범위에 반영할까요?</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                  <button onClick={() => { setSaveConfirm(null); setPanelOpen(false); setSelectedHol(null); }}
                    style={{ padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.brd}`, background: "#fff", color: C.txt, fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
                    <div style={{ fontWeight: 700, marginBottom: 3 }}>이전 휴무일 포함 전체 반영</div>
                    <div style={{ fontSize: 11, color: C.txS, fontWeight: 400 }}>과거 일정을 포함한 전체 휴무에 적용됩니다.</div>
                  </button>
                  <button onClick={() => { setSaveConfirm(null); setPanelOpen(false); setSelectedHol(null); }}
                    style={{ padding: "12px 16px", borderRadius: 8, border: `1px solid ${C.pri}`, background: C.priL, color: C.pri, fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left" }}>
                    <div style={{ fontWeight: 700, marginBottom: 3 }}>이후 휴무일에만 반영</div>
                    <div style={{ fontSize: 11, color: C.txS, fontWeight: 400 }}>선택일({selectedHol?.dateStr}) 이후 일정에만 적용됩니다.</div>
                  </button>
                </div>
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Btn onClick={() => setSaveConfirm(null)}>취소</Btn>
                </div>
              </div>
            </div>
          )}
        </div>
      </SidePanel>
    </div>
  );
};


/* ── 공통코드 관리 ── */
const MgrCommonCode = () => {

  /* ── 샘플 데이터 ── */
  const INIT_GROUPS = [
    { id:"GRP001", nm:"자원 대분류",   desc:"자원의 최상위 분류 코드",   useYn:"Y", cnt:3, regDt:"2026-01-05" },
    { id:"GRP002", nm:"자원 중분류",   desc:"서버/WEB/WAS/DBMS 등 중분류", useYn:"Y", cnt:6, regDt:"2026-01-05" },
    { id:"GRP003", nm:"점검 유형",     desc:"일상점검, 특별점검 구분",   useYn:"Y", cnt:2, regDt:"2026-01-10" },
    { id:"GRP004", nm:"점검 종류",     desc:"점검 세부 종류 코드",       useYn:"Y", cnt:7, regDt:"2026-01-10" },
    { id:"GRP005", nm:"사용자 역할",   desc:"시스템 내 사용자 역할 코드", useYn:"Y", cnt:4, regDt:"2026-01-12" },
    { id:"GRP006", nm:"점검 상태",     desc:"예정/진행/지연/완료",       useYn:"Y", cnt:4, regDt:"2026-01-12" },
    { id:"GRP007", nm:"자원 상태",     desc:"사용/미사용 상태 코드",     useYn:"Y", cnt:2, regDt:"2026-01-15" },
    { id:"GRP008", nm:"시스템 유형",   desc:"정보시스템 유형 분류",     useYn:"Y", cnt:5, regDt:"2026-01-15" },
    { id:"GRP009", nm:"운영환경 구분", desc:"운영/개발/테스트",         useYn:"N", cnt:3, regDt:"2026-01-20" },
    { id:"GRP010", nm:"에이전트 타입", desc:"자동점검 에이전트 종류",   useYn:"Y", cnt:4, regDt:"2026-01-20" },
  ];

  const INIT_CODES = {
    GRP001: [
      { id:"C001-01", grpId:"GRP001", cd:"HW", nm:"하드웨어", desc:"서버, 네트워크 등 물리 장비", sort:1, useYn:"Y" },
      { id:"C001-02", grpId:"GRP001", cd:"SW", nm:"소프트웨어", desc:"WEB, WAS, DBMS 등 소프트웨어", sort:2, useYn:"Y" },
      { id:"C001-03", grpId:"GRP001", cd:"NW", nm:"네트워크", desc:"라우터, 스위치 등 네트워크 장비", sort:3, useYn:"Y" },
    ],
    GRP002: [
      { id:"C002-01", grpId:"GRP002", cd:"SVR", nm:"서버", desc:"물리/가상 서버", sort:1, useYn:"Y" },
      { id:"C002-02", grpId:"GRP002", cd:"WEB", nm:"WEB", desc:"웹서버", sort:2, useYn:"Y" },
      { id:"C002-03", grpId:"GRP002", cd:"WAS", nm:"WAS", desc:"웹 애플리케이션 서버", sort:3, useYn:"Y" },
      { id:"C002-04", grpId:"GRP002", cd:"DBMS", nm:"DBMS", desc:"데이터베이스 서버", sort:4, useYn:"Y" },
      { id:"C002-05", grpId:"GRP002", cd:"SEC", nm:"보안", desc:"방화벽, IDS/IPS 등", sort:5, useYn:"Y" },
      { id:"C002-06", grpId:"GRP002", cd:"ROUTER", nm:"네트워크", desc:"라우터/스위치", sort:6, useYn:"Y" },
    ],
    GRP003: [
      { id:"C003-01", grpId:"GRP003", cd:"DAILY",   nm:"일상점검", desc:"정기 반복 점검", sort:1, useYn:"Y" },
      { id:"C003-02", grpId:"GRP003", cd:"SPECIAL",  nm:"특별점검", desc:"비정기 특별 점검", sort:2, useYn:"Y" },
    ],
    GRP004: [
      { id:"C004-01", grpId:"GRP004", cd:"STATUS",   nm:"상태점검", desc:"자원 상태 확인", sort:1, useYn:"Y" },
      { id:"C004-02", grpId:"GRP004", cd:"VALID",    nm:"유효성점검", desc:"설정값 유효성", sort:2, useYn:"Y" },
      { id:"C004-03", grpId:"GRP004", cd:"SVC",      nm:"서비스점검", desc:"서비스 운영 확인", sort:3, useYn:"Y" },
      { id:"C004-04", grpId:"GRP004", cd:"OFFLINE",  nm:"오프라인점검", desc:"장비 직접 점검", sort:4, useYn:"Y" },
      { id:"C004-05", grpId:"GRP004", cd:"DUAL",     nm:"이중화점검", desc:"이중화 구성 점검", sort:5, useYn:"Y" },
      { id:"C004-06", grpId:"GRP004", cd:"PERF",     nm:"성능점검", desc:"성능 이슈 점검", sort:6, useYn:"Y" },
      { id:"C004-07", grpId:"GRP004", cd:"BUSY",     nm:"업무집중기간점검", desc:"피크타임 집중 점검", sort:7, useYn:"Y" },
    ],
    GRP005: [
      { id:"C005-01", grpId:"GRP005", cd:"SYS_ADMIN", nm:"시스템 관리자", desc:"전체 시스템 관리", sort:1, useYn:"Y" },
      { id:"C005-02", grpId:"GRP005", cd:"ORG_ADMIN", nm:"기관 관리자",   desc:"기관 단위 관리", sort:2, useYn:"Y" },
      { id:"C005-03", grpId:"GRP005", cd:"MAINT",     nm:"유지보수 총괄", desc:"점검 수행 관리", sort:3, useYn:"Y" },
      { id:"C005-04", grpId:"GRP005", cd:"USER",      nm:"사용자",        desc:"점검 수행 담당자", sort:4, useYn:"Y" },
    ],
    GRP006: [
      { id:"C006-01", grpId:"GRP006", cd:"PLAN",  nm:"예정", desc:"점검 예정 상태", sort:1, useYn:"Y" },
      { id:"C006-02", grpId:"GRP006", cd:"PROG",  nm:"진행", desc:"점검 진행 중",   sort:2, useYn:"Y" },
      { id:"C006-03", grpId:"GRP006", cd:"DELAY", nm:"지연", desc:"기한 초과 지연", sort:3, useYn:"Y" },
      { id:"C006-04", grpId:"GRP006", cd:"DONE",  nm:"완료", desc:"점검 완료",      sort:4, useYn:"Y" },
    ],
    GRP007: [
      { id:"C007-01", grpId:"GRP007", cd:"USE",   nm:"사용",   desc:"사용 중인 상태",  sort:1, useYn:"Y" },
      { id:"C007-02", grpId:"GRP007", cd:"UNUSE", nm:"미사용", desc:"미사용 처리 상태", sort:2, useYn:"Y" },
    ],
    GRP008: [
      { id:"C008-01", grpId:"GRP008", cd:"BIZ",   nm:"업무시스템", desc:"", sort:1, useYn:"Y" },
      { id:"C008-02", grpId:"GRP008", cd:"INF",   nm:"인프라",     desc:"", sort:2, useYn:"Y" },
      { id:"C008-03", grpId:"GRP008", cd:"SEC",   nm:"보안시스템", desc:"", sort:3, useYn:"Y" },
      { id:"C008-04", grpId:"GRP008", cd:"SHARE", nm:"공유자원",   desc:"", sort:4, useYn:"Y" },
      { id:"C008-05", grpId:"GRP008", cd:"EXT",   nm:"외부연계",   desc:"", sort:5, useYn:"Y" },
    ],
    GRP009: [
      { id:"C009-01", grpId:"GRP009", cd:"PROD",  nm:"운영", desc:"", sort:1, useYn:"N" },
      { id:"C009-02", grpId:"GRP009", cd:"DEV",   nm:"개발", desc:"", sort:2, useYn:"N" },
      { id:"C009-03", grpId:"GRP009", cd:"TEST",  nm:"테스트", desc:"", sort:3, useYn:"N" },
    ],
    GRP010: [
      { id:"C010-01", grpId:"GRP010", cd:"SSH",   nm:"SSH",  desc:"SSH 기반 점검", sort:1, useYn:"Y" },
      { id:"C010-02", grpId:"GRP010", cd:"SNMP",  nm:"SNMP", desc:"SNMP 프로토콜", sort:2, useYn:"Y" },
      { id:"C010-03", grpId:"GRP010", cd:"API",   nm:"API",  desc:"API 호출 방식", sort:3, useYn:"Y" },
      { id:"C010-04", grpId:"GRP010", cd:"AGENT", nm:"Agent", desc:"에이전트 설치", sort:4, useYn:"Y" },
    ],
  };

  const EMPTY_GRP  = { id:"", nm:"", desc:"", useYn:"Y" };
  const EMPTY_CODE = { id:"", cd:"", nm:"", desc:"", sort:1, useYn:"Y" };

  const [groups,    setGroups]    = useState(INIT_GROUPS);
  const [codesMap,  setCodesMap]  = useState(INIT_CODES);
  const [selGrp,    setSelGrp]    = useState(INIT_GROUPS[0]);
  const [grpSearch, setGrpSearch] = useState("");
  const [cdSearch,  setCdSearch]  = useState("");
  const [useFilter, setUseFilter] = useState("전체");

  /* 패널 상태 */
  const [panel,       setPanel]       = useState(null); // null | "grp-add" | "grp-edit" | "code-add" | "code-edit"
  const [grpForm,     setGrpForm]     = useState(EMPTY_GRP);
  const [codeForm,    setCodeForm]    = useState(EMPTY_CODE);
  const [grpErrors,   setGrpErrors]   = useState({});
  const [codeErrors,  setCodeErrors]  = useState({});

  /* 엑셀 업로드 모달 */
  const [uploadModal, setUploadModal] = useState(false);
  const [delGrpConfirm,  setDelGrpConfirm]  = useState(null);
  const [delCdConfirm,   setDelCdConfirm]   = useState(null);

  /* ── 유틸 ── */
  const sg  = (k, v) => setGrpForm(p => ({ ...p, [k]: v }));
  const sc  = (k, v) => setCodeForm(p => ({ ...p, [k]: v }));
  const closePanel = () => { setPanel(null); setGrpErrors({}); setCodeErrors({}); };

  const currentCodes = (codesMap[selGrp?.id] || [])
    .filter(c => useFilter === "전체" || c.useYn === (useFilter === "사용" ? "Y" : "N"))
    .filter(c => !cdSearch || c.cd.includes(cdSearch) || c.nm.includes(cdSearch))
    .sort((a, b) => a.sort - b.sort);

  const filteredGroups = groups.filter(g =>
    !grpSearch || g.id.includes(grpSearch) || g.nm.includes(grpSearch)
  );

  /* ── 그룹 저장 ── */
  const saveGroup = () => {
    const e = {};
    if (!grpForm.id.trim())  e.id = "그룹 ID를 입력하세요.";
    if (!grpForm.nm.trim())  e.nm = "그룹명을 입력하세요.";
    if (panel === "grp-add" && groups.find(g => g.id === grpForm.id)) e.id = "이미 존재하는 그룹 ID입니다.";
    setGrpErrors(e);
    if (Object.keys(e).length) return;
    if (panel === "grp-add") {
      const newG = { ...grpForm, cnt: 0, regDt: "2026-02-24" };
      setGroups(p => [...p, newG]);
      setCodesMap(p => ({ ...p, [grpForm.id]: [] }));
      setSelGrp(newG);
    } else {
      setGroups(p => p.map(g => g.id === grpForm.id ? { ...g, ...grpForm } : g));
      if (selGrp.id === grpForm.id) setSelGrp(p => ({ ...p, ...grpForm }));
    }
    closePanel();
  };

  /* ── 코드 저장 ── */
  const saveCode = () => {
    const e = {};
    if (!codeForm.cd.trim()) e.cd = "코드를 입력하세요.";
    if (!codeForm.nm.trim()) e.nm = "코드명을 입력하세요.";
    const existing = codesMap[selGrp.id] || [];
    if (panel === "code-add" && existing.find(c => c.cd === codeForm.cd)) e.cd = "이미 존재하는 코드입니다.";
    setCodeErrors(e);
    if (Object.keys(e).length) return;
    if (panel === "code-add") {
      const newC = { ...codeForm, id: `${selGrp.id}-${Date.now()}`, grpId: selGrp.id };
      setCodesMap(p => ({ ...p, [selGrp.id]: [...(p[selGrp.id]||[]), newC] }));
      setGroups(p => p.map(g => g.id === selGrp.id ? { ...g, cnt: g.cnt + 1 } : g));
    } else {
      setCodesMap(p => ({ ...p, [selGrp.id]: p[selGrp.id].map(c => c.id === codeForm.id ? { ...c, ...codeForm } : c) }));
    }
    closePanel();
  };

  /* ── 삭제 ── */
  const deleteGroup = (gid) => {
    setGroups(p => p.filter(g => g.id !== gid));
    setCodesMap(p => { const n = { ...p }; delete n[gid]; return n; });
    if (selGrp?.id === gid) setSelGrp(groups.find(g => g.id !== gid) || null);
    setDelGrpConfirm(null); closePanel();
  };
  const deleteCode = (cid) => {
    setCodesMap(p => ({ ...p, [selGrp.id]: p[selGrp.id].filter(c => c.id !== cid) }));
    setGroups(p => p.map(g => g.id === selGrp.id ? { ...g, cnt: Math.max(0, g.cnt - 1) } : g));
    setDelCdConfirm(null); closePanel();
  };

  /* ── 공통 스타일 ── */
  const thSt = { padding:"9px 12px", fontSize: 14, fontWeight: 400, color: C.txL,
    textAlign:"center", borderBottom:`1px solid ${C.brdD}`, whiteSpace:"nowrap", verticalAlign:"middle" };
  const tdSt = (sel) => ({ padding:"11px 12px", fontSize:15, color:C.txt,
    borderBottom:`1px solid ${C.brd}`, background: sel ? C.priL : "transparent", textAlign:"center", verticalAlign:"middle" });
  const useChip = (yn) => (
    <span style={{ padding:"2px 8px", borderRadius:10, fontSize:11, fontWeight:600,
      background: yn==="Y" ? "#dcfce7" : "#F9FAFC",
      color:      yn==="Y" ? "#16a34a" : "#929292" }}>{yn==="Y" ? "사용" : "미사용"}</span>
  );

  /* ── 패널 내 공통 ── */
  const FRow = ({ label, required, children, err }) => (
    <div style={{ marginBottom:14 }}>
      <label style={{ fontSize:12, color:C.txS, marginBottom:5, display:"block" }}>
        {label}{required && <span style={{ color:C.red, marginLeft:2 }}>*</span>}
      </label>
      {children}
      {err && <div style={{ fontSize:11, color:C.red, marginTop:3 }}>{err}</div>}
    </div>
  );

  /* ── 그룹 패널 JSX ── */
  const GroupPanel = () => {
    const isEdit = panel === "grp-edit";
    return (
      <SidePanel open={panel==="grp-add"||panel==="grp-edit"} onClose={closePanel}
        title={isEdit ? "코드 그룹 수정" : "코드 그룹 등록"} width={480}>
        {isEdit && <PanelDeleteBtn onClick={() => setDelGrpConfirm(grpForm.id)} />}
        <SecTitle label="그룹 기본 정보" primary />
        <FRow label="그룹 ID" required err={grpErrors.id}>
          <input value={grpForm.id} onChange={e => sg("id", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,""))}
            placeholder="예: GRP011" maxLength={20}
            readOnly={isEdit}
            style={{ ...fInput, ...(isEdit ? { background:"#f0f1f3", color:C.txS, pointerEvents:"none" } : {}) }} />
          <div style={{ fontSize:11, color:C.txS, marginTop:3 }}>영문 대문자·숫자만 입력 가능합니다.</div>
        </FRow>
        <FRow label="그룹명" required err={grpErrors.nm}>
          <input value={grpForm.nm} onChange={e => sg("nm", e.target.value)}
            placeholder="그룹명을 입력하세요" maxLength={50} style={fInput} />
        </FRow>
        <FRow label="설명">
          <textarea value={grpForm.desc} onChange={e => sg("desc", e.target.value)}
            placeholder="그룹에 대한 설명" rows={3}
            style={{ ...fInput, resize:"none", fontFamily:"inherit" }} />
        </FRow>
        <FRow label="사용여부">
          <div style={{ display:"flex", gap:16 }}>
            {["Y","N"].map(v => (
              <label key={v} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, cursor:"pointer" }}>
                <input type="radio" checked={grpForm.useYn===v} onChange={() => sg("useYn", v)} />
                {v==="Y" ? "사용" : "미사용"}
              </label>
            ))}
          </div>
        </FRow>
        <PanelFooter onCancel={closePanel} onSave={saveGroup} saveLabel={isEdit ? "저장" : "등록"} />
      </SidePanel>
    );
  };

  /* ── 코드 패널 JSX ── */
  const CodePanel = () => {
    const isEdit = panel === "code-edit";
    return (
      <SidePanel open={panel==="code-add"||panel==="code-edit"} onClose={closePanel}
        title={isEdit ? `코드 수정 — ${selGrp?.nm}` : `코드 등록 — ${selGrp?.nm}`} width={480}>
        {isEdit && <PanelDeleteBtn onClick={() => setDelCdConfirm(codeForm.id)} />}
        <SecTitle label="코드 정보" primary />
        <div style={{ display:"flex", gap:12 }}>
          <div style={{ flex:1 }}>
            <FRow label="코드" required err={codeErrors.cd}>
              <input value={codeForm.cd} onChange={e => sc("cd", e.target.value.toUpperCase())}
                placeholder="예: SVR" maxLength={30}
                readOnly={isEdit}
                style={{ ...fInput, ...(isEdit ? { background:"#f0f1f3", color:C.txS, pointerEvents:"none" } : {}) }} />
            </FRow>
          </div>
          <div style={{ width:80 }}>
            <FRow label="정렬순서">
              <input type="number" min={1} value={codeForm.sort}
                onChange={e => sc("sort", parseInt(e.target.value)||1)} style={fInput} />
            </FRow>
          </div>
        </div>
        <FRow label="코드명" required err={codeErrors.nm}>
          <input value={codeForm.nm} onChange={e => sc("nm", e.target.value)}
            placeholder="코드명을 입력하세요" maxLength={50} style={fInput} />
        </FRow>
        <FRow label="설명">
          <textarea value={codeForm.desc} onChange={e => sc("desc", e.target.value)}
            placeholder="코드 설명 (선택)" rows={3}
            style={{ ...fInput, resize:"none", fontFamily:"inherit" }} />
        </FRow>
        <FRow label="사용여부">
          <div style={{ display:"flex", gap:16 }}>
            {["Y","N"].map(v => (
              <label key={v} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, cursor:"pointer" }}>
                <input type="radio" checked={codeForm.useYn===v} onChange={() => sc("useYn", v)} />
                {v==="Y" ? "사용" : "미사용"}
              </label>
            ))}
          </div>
        </FRow>
        <PanelFooter onCancel={closePanel} onSave={saveCode} saveLabel={isEdit ? "저장" : "등록"} />
      </SidePanel>
    );
  };

  return (
    <div>
      <PH title="공통코드" bc="홈 > 환경설정 > 공통코드" />

      <div style={{ padding:"24px 32px", display:"flex", gap:20, alignItems:"flex-start" }}>

        {/* ══════════ 좌: 코드 그룹 목록 ══════════ */}
        <div style={{ width:360, flexShrink:0, background:"#fff", border:`1px solid ${C.brd}`, borderRadius:10, overflow:"hidden" }}>
          {/* 헤더 */}
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${C.brd}`,
            display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <span style={{ fontSize:13, fontWeight:700, color:C.txt }}>코드 그룹</span>
            <div style={{ display:"flex", gap:6 }}>
              <button onClick={() => { setUploadModal(true); }}
                style={{ padding:"5px 10px", fontSize:11, border:`1px solid ${C.brd}`, borderRadius:5,
                  background:"#fff", cursor:"pointer", color:C.txS, fontWeight:600 }}>엑셀 업로드</button>
              <Btn primary small onClick={() => {
                setGrpForm({ ...EMPTY_GRP });
                setGrpErrors({});
                setPanel("grp-add");
              }}>+ 그룹 추가</Btn>
            </div>
          </div>
          {/* 검색 */}
          <div style={{ padding:"10px 16px", borderBottom:`1px solid ${C.brd}` }}>
            <input value={grpSearch} onChange={e => setGrpSearch(e.target.value)}
              placeholder="그룹 ID 또는 그룹명 검색"
              style={{ ...fInput, fontSize:12 }} />
          </div>
          {/* 그룹 목록 */}
          <div style={{ maxHeight:"calc(100vh - 280px)", overflowY:"auto" }}>
            {filteredGroups.length === 0
              ? <div style={{ padding:32, textAlign:"center", fontSize:12, color:C.txL }}>검색 결과가 없습니다.</div>
              : filteredGroups.map(g => {
                const sel = selGrp?.id === g.id;
                return (
                  <div key={g.id} onClick={() => { setSelGrp(g); setCdSearch(""); setUseFilter("전체"); }}
                    style={{ padding:"11px 16px", borderBottom:`1px solid #f3f4f6`,
                      background: sel ? C.priL : "#fff", cursor:"pointer",
                      borderLeft: sel ? `3px solid ${C.pri}` : "3px solid transparent",
                      transition:"background .1s" }}
                    onMouseEnter={e => { if(!sel) e.currentTarget.style.background="#f8fafc"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = sel ? C.priL : "#fff"; }}>
                    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:3 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:7 }}>
                        <span style={{ fontSize:11, fontWeight:700, color: sel ? C.pri : C.txS,
                          fontFamily:"monospace", background: sel ? "#dbeafe" : "#F9FAFC",
                          padding:"1px 6px", borderRadius:3 }}>{g.id}</span>
                        <span style={{ fontSize:12, fontWeight:600, color: sel ? C.pri : C.txt }}>{g.nm}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                        {useChip(g.useYn)}
                        <span style={{ fontSize:11, color:C.txL }}>{g.cnt}개</span>
                      </div>
                    </div>
                    {g.desc && <div style={{ fontSize:11, color:C.txL, marginTop:1 }}>{g.desc}</div>}
                  </div>
                );
              })
            }
          </div>
          {/* 하단 카운트 */}
          <div style={{ padding:"8px 16px", background:"#F9FAFC", borderTop:`1px solid ${C.brd}`,
            fontSize:11, color:C.txS, display:"flex", justifyContent:"space-between" }}>
            <span>전체 {groups.length}개 그룹</span>
            <span>사용 {groups.filter(g=>g.useYn==="Y").length}개</span>
          </div>
        </div>

        {/* ══════════ 우: 코드 목록 ══════════ */}
        <div style={{ flex:1, minWidth:0, background:"#fff", border:`1px solid ${C.brd}`, borderRadius:10, overflow:"hidden" }}>
          {selGrp ? (<>
            {/* 헤더 */}
            <div style={{ padding:"12px 18px", borderBottom:`1px solid ${C.brd}`,
              display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:13, fontWeight:700, color:C.txt }}>{selGrp.nm}</span>
                <span style={{ fontSize:11, color:C.txS, fontFamily:"monospace",
                  background:"#F9FAFC", padding:"2px 7px", borderRadius:3 }}>{selGrp.id}</span>
                <span style={{ cursor:"pointer", fontSize:11, color:C.pri, fontWeight:600,
                  padding:"3px 8px", border:`1px solid ${C.pri}`, borderRadius:4 }}
                  onClick={() => { setGrpForm({ ...selGrp }); setGrpErrors({}); setPanel("grp-edit"); }}>
                  그룹 수정
                </span>
              </div>
              <Btn primary small onClick={() => {
                setCodeForm({ ...EMPTY_CODE, sort: currentCodes.length + 1 });
                setCodeErrors({});
                setPanel("code-add");
              }}>+ 코드 추가</Btn>
            </div>

            {/* 필터 바 */}
            <div style={{ padding:"10px 18px", borderBottom:`1px solid ${C.brd}`,
              display:"flex", alignItems:"center", gap:10 }}>
              <input value={cdSearch} onChange={e => setCdSearch(e.target.value)}
                placeholder="코드 또는 코드명 검색"
                style={{ ...fInput, width:220, fontSize:12 }} />
              <div style={{ display:"flex", gap:4 }}>
                {["전체","사용","미사용"].map(f => (
                  <button key={f} onClick={() => setUseFilter(f)}
                    style={{ padding:"5px 12px", fontSize:11, fontWeight:600, borderRadius:5, cursor:"pointer",
                      border:`1px solid ${useFilter===f ? C.pri : C.brd}`,
                      background: useFilter===f ? C.priL : "#fff",
                      color: useFilter===f ? C.pri : C.txS }}>
                    {f}
                  </button>
                ))}
              </div>
              <span style={{ marginLeft:"auto", fontSize:11, color:C.txS }}>
                {currentCodes.length}개 코드
              </span>
            </div>

            {/* 테이블 */}
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize: 15, borderBottom: `1px solid ${C.brd}` }}>
                <thead>
                  <tr style={{ borderTop: `1px solid ${C.txH}` }}>
                    {[{h:"순서",w:70},{h:"코드값",mw:120,a:"left"},{h:"항목",mw:150,a:"left"},{h:"설명",a:"left"},{h:"사용여부"},{h:"",w:60}].map(col => (
                      <th key={col.h} style={{ ...thSt, ...(col.w ? { width:col.w } : {}), ...(col.mw ? { minWidth:col.mw } : {}), ...(col.a ? { textAlign:col.a } : {}) }}>{col.h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentCodes.length === 0
                    ? <tr><td colSpan={6} style={{ padding:40, textAlign:"center", fontSize:12, color:C.txL }}>
                        등록된 코드가 없습니다.
                      </td></tr>
                    : currentCodes.map(c => (
                      <tr key={c.id}
                        style={{ cursor:"pointer" }}
                        onClick={() => { setCodeForm({ ...c }); setCodeErrors({}); setPanel("code-edit"); }}
                        onMouseEnter={e => e.currentTarget.style.background=C.secL}
                        onMouseLeave={e => e.currentTarget.style.background=""}>
                        <td style={{...tdSt(false), width:70}}><span style={{ fontSize:11, color:C.txL }}>{c.sort}</span></td>
                        <td style={{...tdSt(false), minWidth:120, textAlign:"left"}}>
                          <span style={{ fontFamily:"monospace", fontSize:13, fontWeight:600, color:C.txt }}>{c.cd}</span>
                        </td>
                        <td style={{...tdSt(false), minWidth:150, textAlign:"left"}}><span style={{ fontWeight:600 }}>{c.nm}</span></td>
                        <td style={{ ...tdSt(false), color:C.txS, textAlign:"left", maxWidth:260 }}>
                          <span style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", display:"block" }}>
                            {c.desc || <span style={{ color:C.txL }}>—</span>}
                          </span>
                        </td>
                        <td style={tdSt(false)}>{useChip(c.useYn)}</td>
                        <td style={{ ...tdSt(false), textAlign:"center" }}>
                          <span onClick={e => { e.stopPropagation(); setDelCdConfirm(c.id); }}
                            style={{ fontSize:16, color:"#fca5a5", cursor:"pointer", fontWeight:700,
                              padding:"0 4px", borderRadius:3,
                              lineHeight:1 }}
                            onMouseEnter={e => e.currentTarget.style.color=C.red}
                            onMouseLeave={e => e.currentTarget.style.color="#fca5a5"}>×</span>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </>) : (
            <div style={{ padding:60, textAlign:"center", fontSize:13, color:C.txL }}>
              왼쪽에서 코드 그룹을 선택하세요.
            </div>
          )}
        </div>
      </div>

      {/* ── 패널들 ── */}
      <GroupPanel />
      <CodePanel />

      {/* ── 엑셀 업로드 모달 ── */}
      {uploadModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.4)", zIndex:1100,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"#fff", borderRadius:12, padding:28, width:420, boxShadow:"0 8px 32px rgba(0,0,0,.2)" }}>
            <div style={{ fontSize:15, fontWeight:700, marginBottom:6 }}>엑셀 업로드</div>
            <div style={{ fontSize:12, color:C.txS, marginBottom:20 }}>
              그룹 ID, 코드, 코드명, 설명, 정렬순서, 사용여부 순서로 작성된 엑셀 파일을 업로드하세요.
            </div>
            <div style={{ border:`2px dashed ${C.brd}`, borderRadius:8, padding:"28px 20px",
              textAlign:"center", background:"#F9FAFC", marginBottom:16, cursor:"pointer" }}
              onClick={() => {}}>
              <div style={{ fontSize:13, color:C.txS, marginBottom:6 }}>파일을 드래그하거나 클릭하여 선택</div>
              <div style={{ fontSize:11, color:C.txL }}>지원 형식: .xlsx, .xls, .csv</div>
            </div>
            <div style={{ fontSize:11, color:C.txS, marginBottom:20 }}>
              * 기존 코드와 동일한 그룹 ID + 코드는 덮어쓰기 됩니다.<br/>
              * 업로드 전 반드시 양식을 확인하세요.{" "}
              <span style={{ color:C.pri, cursor:"pointer", fontWeight:600 }}>양식 다운로드</span>
            </div>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:8 }}>
              <Btn onClick={() => setUploadModal(false)}>취소</Btn>
              <Btn primary onClick={() => setUploadModal(false)}>업로드</Btn>
            </div>
          </div>
        </div>
      )}

      {/* ── 그룹 삭제 확인 ── */}
      {delGrpConfirm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.4)", zIndex:1200,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"#fff", borderRadius:12, padding:28, width:340, boxShadow:"0 8px 32px rgba(0,0,0,.2)" }}>
            <div style={{ fontSize:15, fontWeight:700, color:C.red, marginBottom:8 }}>그룹 삭제</div>
            <div style={{ fontSize:13, color:C.txS, marginBottom:4 }}>
              하위 코드 <strong>{(codesMap[delGrpConfirm]||[]).length}개</strong>가 함께 삭제됩니다.
            </div>
            <div style={{ fontSize:13, color:C.txS, marginBottom:20 }}>삭제 후 복구할 수 없습니다. 계속하시겠습니까?</div>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:8 }}>
              <Btn onClick={() => setDelGrpConfirm(null)}>취소</Btn>
              <button onClick={() => deleteGroup(delGrpConfirm)}
                style={{ padding:"7px 16px", fontSize:13, background:C.red, color:"#fff",
                  border:"none", borderRadius:6, cursor:"pointer", fontWeight:600 }}>삭제</button>
            </div>
          </div>
        </div>
      )}

      {/* ── 코드 삭제 확인 ── */}
      {delCdConfirm && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.4)", zIndex:1200,
          display:"flex", alignItems:"center", justifyContent:"center" }}>
          <div style={{ background:"#fff", borderRadius:12, padding:28, width:320, boxShadow:"0 8px 32px rgba(0,0,0,.2)" }}>
            <div style={{ fontSize:15, fontWeight:700, color:C.red, marginBottom:8 }}>코드 삭제</div>
            <div style={{ fontSize:13, color:C.txS, marginBottom:20 }}>삭제된 코드는 복구할 수 없습니다. 계속하시겠습니까?</div>
            <div style={{ display:"flex", justifyContent:"flex-end", gap:8 }}>
              <Btn onClick={() => setDelCdConfirm(null)}>취소</Btn>
              <button onClick={() => deleteCode(delCdConfirm)}
                style={{ padding:"7px 16px", fontSize:13, background:C.red, color:"#fff",
                  border:"none", borderRadius:6, cursor:"pointer", fontWeight:600 }}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ── 자원 로그 ── */
const MgrResourceLog = () => {

  // snap: 변경 후 전체 자원 필드 스냅샷, changed: 이번에 변경된 필드명 목록, prev: 변경 전 값
  const FIELDS = ["자원명", "상태", "분류", "IP주소", "OS", "버전", "점검자", "관리주체"];
  const INIT_LOGS = [
    { id:"RL001", sysId:"SYS004", actType:"등록",   resNm:"FIN-SVR-01", resCat:"서버",    actor:"홍길동", actorId:"admin",    dt:"2026-02-24 09:05:12",
      changed:["자원명","상태","IP주소","OS"],
      snap:{ 자원명:"FIN-SVR-01", 상태:"사용", 분류:"서버", IP주소:"192.168.10.1", OS:"CentOS 7", 버전:"—", 점검자:"홍길동", 관리주체:"IT운영팀" }, prev:{} },
    { id:"RL002", sysId:"SYS004", actType:"수정",   resNm:"FIN-SVR-01", resCat:"서버",    actor:"홍길동", actorId:"admin",    dt:"2026-02-24 09:32:44",
      changed:["IP주소"],
      snap:{ 자원명:"FIN-SVR-01", 상태:"사용", 분류:"서버", IP주소:"192.168.10.100", OS:"CentOS 7", 버전:"—", 점검자:"홍길동", 관리주체:"IT운영팀" }, prev:{ IP주소:"192.168.10.1" } },
    { id:"RL003", sysId:"SYS008", actType:"수정",   resNm:"SEC-FW-01",  resCat:"보안장비", actor:"이철수", actorId:"sysmgr",  dt:"2026-02-24 10:14:08",
      changed:["상태"],
      snap:{ 자원명:"SEC-FW-01", 상태:"미사용", 분류:"보안장비", IP주소:"10.10.0.1", OS:"—", 버전:"v2.1", 점검자:"이철수", 관리주체:"보안팀" }, prev:{ 상태:"사용" } },
    { id:"RL004", sysId:"SYS002", actType:"등록",   resNm:"HR-WEB-02",  resCat:"WEB",     actor:"김영희", actorId:"jdoe",    dt:"2026-02-24 11:00:55",
      changed:["자원명","상태","IP주소"],
      snap:{ 자원명:"HR-WEB-02", 상태:"사용", 분류:"WEB", IP주소:"10.0.1.22", OS:"Ubuntu 22.04", 버전:"Nginx 1.24", 점검자:"박민준", 관리주체:"HR팀" }, prev:{} },
    { id:"RL005", sysId:"SYS002", actType:"수정",   resNm:"HR-WEB-02",  resCat:"WEB",     actor:"김영희", actorId:"jdoe",    dt:"2026-02-24 11:20:30",
      changed:["점검자"],
      snap:{ 자원명:"HR-WEB-02", 상태:"사용", 분류:"WEB", IP주소:"10.0.1.22", OS:"Ubuntu 22.04", 버전:"Nginx 1.24", 점검자:"최유지", 관리주체:"HR팀" }, prev:{ 점검자:"박민준" } },
    { id:"RL006", sysId:"SYS001", actType:"비활성", resNm:"OLD-SVR-03", resCat:"서버",    actor:"홍길동", actorId:"admin",    dt:"2026-02-24 13:45:21",
      changed:["상태"],
      snap:{ 자원명:"OLD-SVR-03", 상태:"미사용", 분류:"서버", IP주소:"192.168.5.30", OS:"CentOS 6", 버전:"—", 점검자:"홍길동", 관리주체:"IT운영팀" }, prev:{ 상태:"사용" } },
    { id:"RL007", sysId:"SYS004", actType:"수정",   resNm:"FIN-DB-01",  resCat:"DBMS",    actor:"최유지", actorId:"maint01", dt:"2026-02-24 14:10:05",
      changed:["버전"],
      snap:{ 자원명:"FIN-DB-01", 상태:"사용", 분류:"DBMS", IP주소:"192.168.20.5", OS:"RHEL 8", 버전:"Oracle 21c", 점검자:"최유지", 관리주체:"DBA팀" }, prev:{ 버전:"Oracle 19c" } },
    { id:"RL008", sysId:"SYS008", actType:"수정",   resNm:"SEC-FW-01",  resCat:"보안장비", actor:"이철수", actorId:"sysmgr",  dt:"2026-02-24 15:02:33",
      changed:["상태"],
      snap:{ 자원명:"SEC-FW-01", 상태:"사용", 분류:"보안장비", IP주소:"10.10.0.1", OS:"—", 버전:"v2.1", 점검자:"이철수", 관리주체:"보안팀" }, prev:{ 상태:"미사용" } },
    { id:"RL009", sysId:"SHARED", actType:"등록",   resNm:"NET-SW-05",  resCat:"네트워크", actor:"홍길동", actorId:"admin",   dt:"2026-02-23 09:11:00",
      changed:["자원명","상태"],
      snap:{ 자원명:"NET-SW-05", 상태:"사용", 분류:"네트워크", IP주소:"10.0.0.50", OS:"—", 버전:"—", 점검자:"홍길동", 관리주체:"IT운영팀" }, prev:{} },
    { id:"RL010", sysId:"SYS004", actType:"수정",   resNm:"FIN-SVR-01", resCat:"서버",    actor:"박민준", actorId:"inspector",dt:"2026-02-23 10:30:17",
      changed:["점검자"],
      snap:{ 자원명:"FIN-SVR-01", 상태:"사용", 분류:"서버", IP주소:"192.168.10.100", OS:"CentOS 7", 버전:"—", 점검자:"홍길동, 박민준", 관리주체:"IT운영팀" }, prev:{ 점검자:"홍길동" } },
    { id:"RL011", sysId:"SYS002", actType:"수정",   resNm:"HR-WAS-01",  resCat:"WAS",     actor:"최유지", actorId:"maint01", dt:"2026-02-23 11:55:42",
      changed:["버전"],
      snap:{ 자원명:"HR-WAS-01", 상태:"사용", 분류:"WAS", IP주소:"10.0.1.30", OS:"Ubuntu 22.04", 버전:"Tomcat 10.1", 점검자:"최유지", 관리주체:"HR팀" }, prev:{ 버전:"Tomcat 9.0" } },
    { id:"RL012", sysId:"SYS002", actType:"비활성", resNm:"HR-WEB-01",  resCat:"WEB",     actor:"홍길동", actorId:"admin",    dt:"2026-02-22 16:20:05",
      changed:["상태"],
      snap:{ 자원명:"HR-WEB-01", 상태:"미사용", 분류:"WEB", IP주소:"10.0.1.10", OS:"Ubuntu 20.04", 버전:"Nginx 1.22", 점검자:"홍길동", 관리주체:"HR팀" }, prev:{ 상태:"사용" } },
  ];

  const PAGE_SZ = 10;

  const [logs]       = useState(INIT_LOGS);
  const [keyword,    setKeyword]  = useState("");
  const [dateFrom,   setDateFrom] = useState("2026-02-22");
  const [dateTo,     setDateTo]   = useState("2026-02-24");
  const [actType,    setActType]  = useState("전체");
  const [page,       setPage]     = useState(1);
  const [selLog,     setSelLog]   = useState(null);
  const [selSys,     setSelSys]   = useState(null);

  const ACT_TYPES = ["전체", "등록", "수정", "비활성"];

  /* ── 정보시스템별 로그 건수 ── */
  const sysLogCount = sysId => logs.filter(l => l.sysId === sysId).length;

  /* ── 필터 ── */
  const filtered = logs.filter(l => {
    const kw = keyword.trim().toLowerCase();
    if (selSys && l.sysId !== selSys) return false;
    if (kw && !l.resNm.toLowerCase().includes(kw) && !l.actor.includes(kw) && !l.actorId.toLowerCase().includes(kw) && !l.resCat.includes(kw)) return false;
    if (actType !== "전체" && l.actType !== actType) return false;
    if (dateFrom && l.dt.slice(0, 10) < dateFrom) return false;
    if (dateTo   && l.dt.slice(0, 10) > dateTo)   return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SZ));
  const paged      = filtered.slice((page - 1) * PAGE_SZ, page * PAGE_SZ);

  const search = () => setPage(1);
  const reset  = () => { setKeyword(""); setDateFrom("2026-02-22"); setDateTo("2026-02-24"); setActType("전체"); setPage(1); };

  /* ── 작업유형 배지 ── */
  const ActBadge = ({ v }) => {
    const MAP = {
      "등록":   { bg: "#dcfce7", c: "#16a34a" },
      "수정":   { bg: "#dbeafe", c: "#1d4ed8" },
      "비활성": { bg: "#f1f5f9", c: "#64748b" },
    };
    const s = MAP[v] || { bg: "#F9FAFC", c: "#929292" };
    return <span style={{ padding: "2px 9px", borderRadius: 10, fontSize: 11, fontWeight: 700, background: s.bg, color: s.c }}>{v}</span>;
  };

  return (
    <div>
      <PH title="자원로그" bc="홈 > 로그정보 > 자원로그" />

      <div>

        <div style={{ width: "100%", border: `1px solid ${C.brd}`, background: C.bg, borderRadius: 6, padding: "12px", display: "flex", gap: 8, marginBottom: 16, alignItems: "stretch" }}>
          <div style={{ display: "flex", flex: 1, gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.txL }}>자원/사용자</span>
              <input value={keyword} onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && search()}
                placeholder="자원명, 분류, 작업자"
                style={{ padding: "6px 12px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, outline: "none", color: C.txt, background: "#fff", height: 36, width: 180, fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.txL }}>기간</span>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ padding: "6px 10px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, outline: "none", color: C.txt, background: "#fff", height: 36, fontFamily: "inherit", boxSizing: "border-box" }} />
                <span style={{ color: C.txL, fontSize: 12 }}>~</span>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ padding: "6px 10px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, outline: "none", color: C.txt, background: "#fff", height: 36, fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.txL }}>작업유형</span>
              <select value={actType} onChange={e => setActType(e.target.value)} style={{ padding: "6px 10px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, background: "#fff", color: C.txt, height: 36, fontFamily: "inherit", boxSizing: "border-box" }}>
                {ACT_TYPES.map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={search} style={{ background: "#fff", border: `1px solid ${C.sec}`, color: C.sec, borderRadius: 4, padding: "0 24px", fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", height: 36, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s" }}
              onMouseEnter={e => { e.currentTarget.style.background = C.sec; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = C.sec; }}>검색</button>
            <button onClick={reset} title="검색 초기화" style={{ background: C.priL, border: `1px solid ${C.pri}40`, borderRadius: 4, padding: "0 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", height: 36, boxSizing: "border-box" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 2v4h-4" stroke={C.pri} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.5 10a6 6 0 11-1.3-6.3L14 6" stroke={C.pri} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>

        {/* sec-title */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingTop: 38, paddingBottom: 8, borderBottom: `1px solid ${C.brdD}`, marginBottom: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: C.txH }}>자원 변경 이력</span>
            <span style={{ fontSize: 12, color: C.txL }}>{filtered.length}건</span>
          </div>
        </div>

          <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: "100%", width: "max-content", borderCollapse: "collapse", fontSize: 15, borderBottom: `1px solid ${C.brd}` }}>
            <thead>
              <tr style={{ borderTop: `1px solid ${C.txH}` }}>
                {[["No.", 70], ["작업 유형", 90], ["정보시스템", 140], ["대상 자원", 140], ["분류", 90], ["작업자", 100], ["작업 일시", 155]].map(([h, w], i) => (
                  <th key={i} style={{ padding: "9px 12px", borderBottom: `1px solid ${C.brdD}`, textAlign: "center", fontSize: 14, fontWeight: 400, color: C.txL, whiteSpace: "nowrap", verticalAlign: "middle" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((l, idx) => {
                const sysNm = SYS.find(s => s.id === l.sysId)?.nm || l.sysId;
                return (
                  <tr key={l.id} onClick={() => setSelLog(l)}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = C.secL}
                    onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle", color: C.txL, fontSize: 12 }}>{(page - 1) * PAGE_SZ + idx + 1}</td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle" }}><ActBadge v={l.actType} /></td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle", color: C.txt }}>{sysNm}</td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle", fontWeight: 600, color: C.txt }}>{l.resNm}</td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle", color: C.txt }}>{l.resCat}</td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle", color: C.txt }}>{l.actor}</td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle", color: C.txt, fontFamily: "monospace", fontSize: 13 }}>{l.dt}</td>
                  </tr>
                );
              })}
              {!paged.length && (
                <tr><td colSpan={7} style={{ padding: 48, textAlign: "center", color: C.txL, fontSize: 13 }}>조회된 자원 변경 이력이 없습니다.</td></tr>
              )}
            </tbody>
          </table>
          </div>

          <GuiPag page={page} totalPages={totalPages} setPage={setPage} />
        </div>

      {/* ══ 상세 패널 ══ */}
      <SidePanel open={!!selLog} onClose={() => setSelLog(null)} title="자원 로그 상세" width={460}>
        {selLog && (() => {
          const history = logs
            .filter(l => l.resNm === selLog.resNm && l.id !== selLog.id)
            .sort((a, b) => b.dt.localeCompare(a.dt));
          return (
          <>
            {/* 기본 정보 */}
            <SecTitle label="작업 정보" primary />
            <div style={{ background: "#f8fafc", borderRadius: 8, border: `1px solid ${C.brd}`, overflow: "hidden", marginBottom: 20 }}>
              {[
                ["작업 유형",  <ActBadge v={selLog.actType} />, false],
                ["대상 자원",  selLog.resNm,                    false],
                ["자원 분류",  selLog.resCat,                   false],
                ["작업자",     `${selLog.actor} (${selLog.actorId})`, true],
                ["작업 일시",  selLog.dt,                       true],
              ].map(([label, val, mono], i, arr) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "11px 14px", borderBottom: i < arr.length - 1 ? `1px solid ${C.brd}` : "none", fontSize: 12 }}>
                  <span style={{ color: C.txS, flexShrink: 0 }}>{label}</span>
                  <span style={{ color: C.txt, fontWeight: 500, fontFamily: mono ? "monospace" : "inherit", fontSize: mono ? 12 : 13 }}>{val}</span>
                </div>
              ))}
            </div>

            {/* 변경 히스토리 */}
            <SecTitle label={`변경 히스토리 · ${selLog.resNm}`} primary />
            {history.length === 0 ? (
              <div style={{ padding: "16px 0", fontSize: 12, color: C.txL, textAlign: "center" }}>다른 변경 이력이 없습니다.</div>
            ) : (
              <div style={{ position: "relative", paddingLeft: 20, marginBottom: 24 }}>
                {/* 타임라인 세로선 */}
                <div style={{ position: "absolute", left: 6, top: 6, bottom: 6, width: 2, background: C.brd }} />
                {history.map((h, i) => (
                  <div key={h.id} style={{ position: "relative", marginBottom: i < history.length - 1 ? 16 : 0 }}>
                    {/* 점 */}
                    <div style={{ position: "absolute", left: -17, top: 3, width: 8, height: 8, borderRadius: "50%",
                      background: h.actType === "등록" ? "#16a34a" : h.actType === "비활성" ? "#94a3b8" : C.pri,
                      border: "2px solid #fff", boxShadow: "0 0 0 1px #e2e8f0" }} />
                    <div style={{ background: "#f8fafc", border: `1px solid ${C.brd}`, borderRadius: 8, padding: "10px 12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                        <ActBadge v={h.actType} />
                        <span style={{ fontSize: 11, color: C.txL, fontFamily: "monospace" }}>{h.dt}</span>
                      </div>
                      <div style={{ fontSize: 12, color: C.txS, marginBottom: 4 }}>
                        <span style={{ fontWeight: 600, color: C.txt }}>{h.actor}</span>
                        {h.changed.length > 0 && (
                          <span> · {h.changed.map((f, fi) => {
                            const prev = h.prev?.[f];
                            const cur  = h.snap?.[f];
                            return (
                              <span key={fi}>
                                {fi > 0 && ", "}
                                <span style={{ fontWeight: 600, color: C.txt }}>{f}</span>
                                {prev && <span style={{ color: "#94a3b8", textDecoration: "line-through", margin: "0 3px" }}>{prev}</span>}
                                {prev && <span style={{ color: C.txL, margin: "0 3px" }}>→</span>}
                                <span style={{ color: C.pri, fontWeight: 600 }}>{cur}</span>
                              </span>
                            );
                          })}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <PanelFooter onCancel={() => setSelLog(null)} onSave={() => setSelLog(null)} saveLabel="확인" />
          </>
          );
        })()}
      </SidePanel>
    </div>
  );
};

/* ── 점검 로그 ── */
const MgrInspLog = () => {
  const PAGE_SZ = 10;

  const INIT_LOGS = [
    { id:"IL001", inspType:"일상점검", actType:"점검 생성",   resNm:"CRM-SVR-01", sysNm:"고객관리시스템", checklistNm:"서버 상태점검표", actor:"시스템",    actorId:"system",    dt:"2026-02-24 00:00:01", stFrom:null,      stTo:"예정",  detail:"정기 스케줄에 의해 자동 생성" },
    { id:"IL002", inspType:"일상점검", actType:"점검 수행",   resNm:"CRM-SVR-01", sysNm:"고객관리시스템", checklistNm:"서버 상태점검표", actor:"홍길동",    actorId:"admin",     dt:"2026-02-24 09:05:33", stFrom:"예정",    stTo:"진행",  detail:"자동점검 수행 시작 (검증코드 12개)" },
    { id:"IL003", inspType:"일상점검", actType:"결과 보고",   resNm:"CRM-SVR-01", sysNm:"고객관리시스템", checklistNm:"서버 상태점검표", actor:"홍길동",    actorId:"admin",     dt:"2026-02-24 09:32:10", stFrom:"진행",    stTo:"완료",  detail:"점검 결과 제출 완료 (정상 11, 비정상 1)" },
    { id:"IL004", inspType:"일상점검", actType:"점검 생성",   resNm:"CRM-WEB-02", sysNm:"고객관리시스템", checklistNm:"WEB 상태점검표", actor:"시스템",    actorId:"system",    dt:"2026-02-24 00:00:02", stFrom:null,      stTo:"예정",  detail:"정기 스케줄에 의해 자동 생성" },
    { id:"IL005", inspType:"일상점검", actType:"상태 변경",   resNm:"CRM-WEB-02", sysNm:"고객관리시스템", checklistNm:"WEB 상태점검표", actor:"시스템",    actorId:"system",    dt:"2026-02-24 18:00:00", stFrom:"예정",    stTo:"지연",  detail:"점검 기한 초과로 자동 지연 처리" },
    { id:"IL006", inspType:"특별점검", actType:"점검 생성",   resNm:"FIN-DB-01",  sysNm:"재무회계시스템", checklistNm:"DBMS 성능점검표", actor:"이기관",    actorId:"orgadmin",  dt:"2026-02-24 10:00:00", stFrom:null,      stTo:"예정",  detail:"특별점검 등록 (마감기간 성능 이슈 대응)" },
    { id:"IL007", inspType:"특별점검", actType:"점검 수행",   resNm:"FIN-DB-01",  sysNm:"재무회계시스템", checklistNm:"DBMS 성능점검표", actor:"박유지보수", actorId:"maintmgr",  dt:"2026-02-24 14:15:22", stFrom:"예정",    stTo:"진행",  detail:"육안점검 항목 입력 중" },
    { id:"IL008", inspType:"특별점검", actType:"결과 보고",   resNm:"FIN-DB-01",  sysNm:"재무회계시스템", checklistNm:"DBMS 성능점검표", actor:"박유지보수", actorId:"maintmgr",  dt:"2026-02-24 16:50:44", stFrom:"진행",    stTo:"완료",  detail:"결과 제출 및 첨부파일 2건 등록" },
    { id:"IL009", inspType:"일상점검", actType:"점검 생성",   resNm:"HR-SVR-01",  sysNm:"인사관리시스템", checklistNm:"서버 상태점검표", actor:"시스템",    actorId:"system",    dt:"2026-02-23 00:00:01", stFrom:null,      stTo:"예정",  detail:"정기 스케줄에 의해 자동 생성" },
    { id:"IL010", inspType:"일상점검", actType:"결과 보고",   resNm:"HR-SVR-01",  sysNm:"인사관리시스템", checklistNm:"서버 상태점검표", actor:"최점검",    actorId:"user01",    dt:"2026-02-23 10:22:08", stFrom:"진행",    stTo:"완료",  detail:"정상 완료" },
    { id:"IL011", inspType:"특별점검", actType:"점검 생성",   resNm:"SEC-NET-01", sysNm:"보안관제시스템", checklistNm:"보안장비 이중화점검표", actor:"이기관", actorId:"orgadmin",  dt:"2026-02-23 09:00:00", stFrom:null,      stTo:"예정",  detail:"보안장비 이중화 점검 등록" },
    { id:"IL012", inspType:"특별점검", actType:"상태 변경",   resNm:"SEC-NET-01", sysNm:"보안관제시스템", checklistNm:"보안장비 이중화점검표", actor:"시스템", actorId:"system",    dt:"2026-02-23 23:59:59", stFrom:"예정",    stTo:"지연",  detail:"점검 기한 초과" },
    { id:"IL013", inspType:"일상점검", actType:"점검 수행",   resNm:"LOG-SVR-01", sysNm:"물류관리시스템", checklistNm:"서버 상태점검표", actor:"정담당",    actorId:"user02",    dt:"2026-02-22 09:10:00", stFrom:"예정",    stTo:"진행",  detail:"자동점검 수행 (검증코드 8개)" },
    { id:"IL014", inspType:"일상점검", actType:"결과 보고",   resNm:"LOG-SVR-01", sysNm:"물류관리시스템", checklistNm:"서버 상태점검표", actor:"정담당",    actorId:"user02",    dt:"2026-02-22 09:45:30", stFrom:"진행",    stTo:"완료",  detail:"정상 완료" },
    { id:"IL015", inspType:"특별점검", actType:"결과 보고",   resNm:"WEB-WEB-01", sysNm:"홈페이지",       checklistNm:"홈페이지 오프라인점검표", actor:"홍길동", actorId:"admin",    dt:"2026-02-22 15:20:00", stFrom:"진행",    stTo:"완료",  detail:"오프라인 점검 완료 후 서비스 복구 확인" },
  ];

  const TODAY = "2026-02-24";

  const [logs]                  = useState(INIT_LOGS);
  const [keyword,  setKeyword]  = useState("");
  const [inspType, setInspType] = useState("전체");
  const [actType,  setActType]  = useState("전체");
  const [stFilter, setStFilter] = useState("전체");
  const [dateFrom, setDateFrom] = useState("2026-02-22");
  const [dateTo,   setDateTo]   = useState(TODAY);
  const [page,     setPage]     = useState(1);
  const [selLog,   setSelLog]   = useState(null);

  const filtered = logs.filter(l => {
    const kw = keyword.trim().toLowerCase();
    if (kw && !l.resNm.toLowerCase().includes(kw) && !l.sysNm.includes(kw) && !l.actor.includes(kw) && !l.actorId.toLowerCase().includes(kw)) return false;
    if (inspType !== "전체" && l.inspType !== inspType) return false;
    if (actType  !== "전체" && l.actType  !== actType)  return false;
    if (stFilter !== "전체" && l.stTo     !== stFilter) return false;
    if (dateFrom && l.dt.slice(0, 10) < dateFrom) return false;
    if (dateTo   && l.dt.slice(0, 10) > dateTo)   return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SZ));
  const paged = filtered.slice((page - 1) * PAGE_SZ, page * PAGE_SZ);
  const search = () => setPage(1);
  const reset  = () => { setKeyword(""); setInspType("전체"); setActType("전체"); setStFilter("전체"); setDateFrom("2026-02-22"); setDateTo(TODAY); setPage(1); };

  /* ── 배지 ── */
  const ActTypeBadge = ({ v }) => {
    const map = { "점검 생성": [C.priL,"#2563eb"], "점검 수행": ["#f0fdf4","#16a34a"], "결과 보고": ["#fefce8","#ca8a04"], "상태 변경": ["#fdf4ff","#9333ea"] };
    const [bg, tx] = map[v] || ["#F9FAFC","#929292"];
    return <span style={{ padding:"2px 9px", borderRadius:10, fontSize:11, fontWeight:700, background:bg, color:tx }}>{v}</span>;
  };
  const InspTypeBadge = ({ v }) => (
    <span style={{ padding:"2px 9px", borderRadius:10, fontSize:11, fontWeight:600,
      background: v === "특별점검" ? "#fdf0e6" : "#e0f2fe",
      color:      v === "특별점검" ? "#e8915b" : "#0369a1" }}>{v}</span>
  );
  const StBadge = ({ v }) => {
    if (!v) return <span style={{ color: C.txL, fontSize: 12 }}>—</span>;
    const s = SC[v] || { b:"#F9FAFC", t:"#929292" };
    return <span style={{ padding:"2px 9px", borderRadius:10, fontSize:11, fontWeight:700, background:s.b, color:s.t }}>{v}</span>;
  };

  return (
    <div>
      <PH title="점검로그" bc="홈 > 로그정보 > 점검로그" />

      <div>

        {/* ── 검색 영역 (searchform) ── */}
        <div style={{ width: "100%", border: `1px solid ${C.brd}`, background: C.bg, borderRadius: 6, padding: "12px", display: "flex", gap: 8, marginBottom: 16, alignItems: "stretch" }}>
          <div style={{ display: "flex", flex: 1, gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.txL }}>자원/작업자</span>
              <input value={keyword} onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && search()}
                placeholder="자원명, 시스템명, 작업자"
                style={{ padding: "6px 12px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, outline: "none", color: C.txt, background: "#fff", height: 36, width: 180, fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.txL }}>기간</span>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ padding: "6px 10px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, outline: "none", color: C.txt, background: "#fff", height: 36, fontFamily: "inherit", boxSizing: "border-box" }} />
                <span style={{ color: C.txL, fontSize: 12 }}>~</span>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ padding: "6px 10px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, outline: "none", color: C.txt, background: "#fff", height: 36, fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.txL }}>점검유형</span>
              <select value={inspType} onChange={e => setInspType(e.target.value)} style={{ padding: "6px 10px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, background: "#fff", color: C.txt, height: 36, fontFamily: "inherit", boxSizing: "border-box" }}>
                {["전체","일상점검","특별점검"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.txL }}>이벤트</span>
              <select value={actType} onChange={e => setActType(e.target.value)} style={{ padding: "6px 10px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, background: "#fff", color: C.txt, height: 36, fontFamily: "inherit", boxSizing: "border-box" }}>
                {["전체","점검 생성","점검 수행","결과 보고","상태 변경"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.txL }}>상태</span>
              <select value={stFilter} onChange={e => setStFilter(e.target.value)} style={{ padding: "6px 10px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, background: "#fff", color: C.txt, height: 36, fontFamily: "inherit", boxSizing: "border-box" }}>
                {["전체","예정","진행","지연","완료"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={search} style={{ background: "#fff", border: `1px solid ${C.sec}`, color: C.sec, borderRadius: 4, padding: "0 24px", fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", height: 36, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s" }}
              onMouseEnter={e => { e.currentTarget.style.background = C.sec; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = C.sec; }}>검색</button>
            <button onClick={reset} title="검색 초기화" style={{ background: C.priL, border: `1px solid ${C.pri}40`, borderRadius: 4, padding: "0 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", height: 36, boxSizing: "border-box" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 2v4h-4" stroke={C.pri} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.5 10a6 6 0 11-1.3-6.3L14 6" stroke={C.pri} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>

        {/* sec-title */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingTop: 38, paddingBottom: 8, borderBottom: `1px solid ${C.brdD}`, marginBottom: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: C.txH }}>점검 이력</span>
            <span style={{ fontSize: 12, color: C.txL }}>{filtered.length}건</span>
          </div>
        </div>

          <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: "100%", width: "max-content", borderCollapse: "collapse", fontSize: 15, borderBottom: `1px solid ${C.brd}` }}>
            <thead>
              <tr style={{ borderTop: `1px solid ${C.txH}` }}>
                {[["No.",70],["이벤트",110],["점검 유형",100],["자원",120],["정보시스템",130],["점검표",160],["작업자",100],["상태",90],["작업 일시",160]].map(([h,w],i) => (
                  <th key={i} style={{ padding:"9px 12px", textAlign:"center", fontSize: 14, fontWeight: 400, color: C.txL, whiteSpace:"nowrap", borderBottom: `1px solid ${C.brdD}`, verticalAlign: "middle" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((l, idx) => (
                <tr key={l.id} onClick={() => setSelLog(l)}
                  style={{ cursor:"pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.secL}
                  onMouseLeave={e => e.currentTarget.style.background = ""}>
                  <td style={{ padding:"11px 12px", borderBottom:`1px solid ${C.brd}`, textAlign:"center", verticalAlign:"middle", color:C.txL, fontSize:12 }}>{(page-1)*PAGE_SZ+idx+1}</td>
                  <td style={{ padding:"11px 12px", borderBottom:`1px solid ${C.brd}`, textAlign:"center", verticalAlign:"middle" }}><ActTypeBadge v={l.actType} /></td>
                  <td style={{ padding:"11px 12px", borderBottom:`1px solid ${C.brd}`, textAlign:"center", verticalAlign:"middle" }}><InspTypeBadge v={l.inspType} /></td>
                  <td style={{ padding:"11px 12px", borderBottom:`1px solid ${C.brd}`, textAlign:"center", verticalAlign:"middle", fontWeight:600, color:C.pri }}>{l.resNm}</td>
                  <td style={{ padding:"11px 12px", borderBottom:`1px solid ${C.brd}`, textAlign:"center", verticalAlign:"middle", color:C.txt, fontSize:13 }}>{l.sysNm}</td>
                  <td style={{ padding:"11px 12px", borderBottom:`1px solid ${C.brd}`, textAlign:"center", verticalAlign:"middle", color:C.txt, fontSize:13 }}>{l.checklistNm}</td>
                  <td style={{ padding:"11px 12px", borderBottom:`1px solid ${C.brd}`, textAlign:"center", verticalAlign:"middle", color:C.txt }}>{l.actor}</td>
                  <td style={{ padding:"11px 12px", borderBottom:`1px solid ${C.brd}`, textAlign:"center", verticalAlign:"middle" }}><StBadge v={l.stTo} /></td>
                  <td style={{ padding:"11px 12px", borderBottom:`1px solid ${C.brd}`, textAlign:"center", verticalAlign:"middle", color:C.txt, fontFamily:"monospace", fontSize:13 }}>{l.dt}</td>
                </tr>
              ))}
              {!paged.length && (
                <tr><td colSpan={9} style={{ padding:48, textAlign:"center", color:C.txL, fontSize:13 }}>조회된 점검 이력이 없습니다.</td></tr>
              )}
            </tbody>
          </table>
          </div>

          <GuiPag page={page} totalPages={totalPages} setPage={setPage} />
        </div>

      {/* ══ 상세 패널 ══ */}
      <SidePanel open={!!selLog} onClose={() => setSelLog(null)} title="점검 로그 상세" width={440}>
        {selLog && (() => {
          const resHistory = logs
            .filter(l => l.resNm === selLog.resNm && l.id !== selLog.id)
            .sort((a, b) => b.dt.localeCompare(a.dt))
            .slice(0, 10);
          return (
            <>
              <SecTitle label="작업 정보" primary />
              <div style={{ background:"#f8fafc", borderRadius:8, border:`1px solid ${C.brd}`, overflow:"hidden", marginBottom:20 }}>
                {[
                  ["이벤트",    <ActTypeBadge v={selLog.actType} />,   false],
                  ["점검 유형", <InspTypeBadge v={selLog.inspType} />, false],
                  ["대상 자원", selLog.resNm,                          false],
                  ["정보시스템",selLog.sysNm,                          false],
                  ["점검표",    selLog.checklistNm,                    false],
                  ["작업자",    `${selLog.actor} (${selLog.actorId})`, true ],
                  ["작업 일시", selLog.dt,                             true ],
                ].map(([label, val, mono], i, arr) => (
                  <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                    padding:"11px 14px", borderBottom: i < arr.length-1 ? `1px solid ${C.brd}` : "none", fontSize:12 }}>
                    <span style={{ color:C.txS, flexShrink:0 }}>{label}</span>
                    {typeof val === "string"
                      ? <span style={{ color:C.txt, fontWeight:500, fontFamily:mono?"monospace":"inherit", fontSize:mono?12:13 }}>{val}</span>
                      : val}
                  </div>
                ))}
                {/* 상태 */}
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"11px 14px", fontSize:12 }}>
                  <span style={{ color:C.txS }}>상태</span>
                  <StBadge v={selLog.stTo} />
                </div>
              </div>

              {/* 상세 내용 */}
              {selLog.detail && (
                <>
                  <SecTitle label="상세 내용" primary />
                  <div style={{ background:"#f8fafc", border:`1px solid ${C.brd}`, borderRadius:8, padding:"12px 14px", fontSize:12, color:C.txS, lineHeight:1.6, marginBottom:20 }}>
                    {selLog.detail}
                  </div>
                </>
              )}

              {/* 자원 점검 히스토리 */}
              <SecTitle label={`점검 히스토리 · ${selLog.resNm}`} primary />
              {resHistory.length === 0 ? (
                <div style={{ padding:"16px 0", fontSize:12, color:C.txL, textAlign:"center" }}>다른 점검 이력이 없습니다.</div>
              ) : (
                <div style={{ position:"relative", paddingLeft:20, marginBottom:24 }}>
                  <div style={{ position:"absolute", left:6, top:6, bottom:6, width:2, background:C.brd }} />
                  {resHistory.map((h, i) => {
                    const dotColor = h.actType==="점검 생성" ? "#2563eb" : h.actType==="결과 보고" ? "#16a34a" : h.actType==="상태 변경" && h.stTo==="지연" ? "#e8915b" : C.pri;
                    return (
                      <div key={h.id} style={{ position:"relative", marginBottom: i < resHistory.length-1 ? 12 : 0 }}>
                        <div style={{ position:"absolute", left:-17, top:4, width:8, height:8, borderRadius:"50%",
                          background:dotColor, border:"2px solid #fff", boxShadow:"0 0 0 1px #e2e8f0" }} />
                        <div style={{ background:"#f8fafc", border:`1px solid ${C.brd}`, borderRadius:8, padding:"9px 12px" }}>
                          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                            <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                              <ActTypeBadge v={h.actType} />
                              <InspTypeBadge v={h.inspType} />
                            </div>
                            <span style={{ fontSize:11, color:C.txL, fontFamily:"monospace" }}>{h.dt}</span>
                          </div>
                          <div style={{ fontSize:12, color:C.txS, display:"flex", alignItems:"center", gap:6 }}>
                            <span style={{ fontWeight:600, color:C.txt }}>{h.actor}</span>
                            {h.stFrom && <><span style={{ color:C.txL }}>·</span><StBadge v={h.stFrom} /><span style={{ fontSize:11, color:C.txL }}>→</span><StBadge v={h.stTo} /></>}
                          </div>
                          {h.detail && <div style={{ fontSize:11, color:C.txL, marginTop:4 }}>{h.detail}</div>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <PanelFooter onCancel={() => setSelLog(null)} onSave={() => setSelLog(null)} saveLabel="확인" />
            </>
          );
        })()}
      </SidePanel>
    </div>
  );
};

/* ── 에러 로그 ── */
const MgrErrorLog = () => {
  const PAGE_SZ = 10;

  const ERR_TYPES = ["전체", "시스템 오류", "인증 오류", "DB 오류", "API 오류", "권한 오류"];
  const MODULES   = ["전체", "자원관리", "점검관리", "사용자관리", "인증", "API Gateway", "배치"];
  const STATUSES  = ["미처리", "처리 중", "처리 완료"];

  const STATUS_STYLE = {
    "미처리":    { bg: "#fee2e2", c: "#dc2626", border: "#fca5a5" },
    "처리 중":   { bg: "#fef9c3", c: "#ca8a04", border: "#fde68a" },
    "처리 완료": { bg: "#dcfce7", c: "#16a34a", border: "#86efac" },
  };
  const TYPE_STYLE = {
    "시스템 오류": { bg: "#fee2e2", c: "#dc2626" },
    "인증 오류":   { bg: "#fef3c7", c: "#d97706" },
    "DB 오류":     { bg: "#ede9fe", c: "#7c3aed" },
    "API 오류":    { bg: "#dbeafe", c: "#1d4ed8" },
    "권한 오류":   { bg: "#f1f5f9", c: "#475569" },
  };

  const INIT_LOGS = [
    { id:"EL001", dt:"2026-02-24 09:03:11", errType:"인증 오류",   module:"인증",        msg:"로그인 시도 횟수 초과 - 계정 잠금 처리",   user:"sysmgr",    reqUrl:"/api/auth/login",          status:"처리 완료", detail:"IP 10.0.0.5에서 5회 연속 로그인 실패. 계정 자동 잠금 적용." },
    { id:"EL002", dt:"2026-02-24 09:45:22", errType:"DB 오류",     module:"자원관리",    msg:"DB Connection Pool 한계 도달",             user:"—",         reqUrl:"/api/resource/list",        status:"처리 완료", detail:"Connection pool 최대치(50) 도달. 신규 연결 대기 타임아웃 발생." },
    { id:"EL003", dt:"2026-02-24 10:12:05", errType:"API 오류",    module:"API Gateway", msg:"외부 Core API 응답 타임아웃",              user:"—",         reqUrl:"/api/core/inspect",         status:"처리 중",   detail:"Core 서버 응답 30초 초과. 자동점검 항목 3건 실패 처리됨." },
    { id:"EL004", dt:"2026-02-24 11:08:33", errType:"권한 오류",   module:"사용자관리",  msg:"접근 권한 없는 메뉴 직접 접근 시도",      user:"user01",    reqUrl:"/api/admin/users",          status:"처리 완료", detail:"일반 사용자가 사용자 관리 API 직접 호출 시도. 403 반환." },
    { id:"EL005", dt:"2026-02-24 12:30:44", errType:"시스템 오류", module:"배치",        msg:"정기점검 배치 실행 실패",                  user:"—",         reqUrl:"/batch/schedule/run",       status:"미처리",    detail:"스케줄 ID SCH-042 배치 실행 중 NullPointerException 발생." },
    { id:"EL006", dt:"2026-02-24 13:22:17", errType:"DB 오류",     module:"점검관리",    msg:"점검 결과 저장 실패 - 중복 키 오류",      user:"inspector", reqUrl:"/api/inspect/result/save",  status:"처리 완료", detail:"동일 점검 건에 대한 중복 제출 시도. UniqueConstraintException." },
    { id:"EL007", dt:"2026-02-24 14:05:59", errType:"API 오류",    module:"API Gateway", msg:"Core API 인증 토큰 만료",                  user:"—",         reqUrl:"/api/core/auto-check",      status:"처리 중",   detail:"Core 연동 토큰 만료로 자동점검 실패. 토큰 재발급 진행 중." },
    { id:"EL008", dt:"2026-02-24 15:44:03", errType:"시스템 오류", module:"자원관리",    msg:"파일 업로드 용량 초과",                    user:"jdoe",      reqUrl:"/api/resource/file/upload", status:"처리 완료", detail:"첨부파일 크기 50MB 초과(실제 87MB). 업로드 차단 처리." },
    { id:"EL009", dt:"2026-02-24 16:18:29", errType:"인증 오류",   module:"인증",        msg:"세션 만료 후 API 접근 시도",               user:"maint01",   reqUrl:"/api/inspect/list",         status:"처리 완료", detail:"세션 토큰 만료 후 재요청. 401 반환 및 로그인 페이지 리다이렉트." },
    { id:"EL010", dt:"2026-02-23 09:30:00", errType:"시스템 오류", module:"배치",        msg:"메일 알림 발송 실패",                      user:"—",         reqUrl:"/batch/notify/email",       status:"미처리",    detail:"SMTP 서버 연결 실패. 점검 지연 알림 12건 미발송 상태." },
    { id:"EL011", dt:"2026-02-23 11:15:42", errType:"DB 오류",     module:"점검관리",    msg:"대용량 점검 이력 조회 타임아웃",           user:"admin",     reqUrl:"/api/inspect/history",      status:"처리 완료", detail:"6개월 이상 이력 조회 시 쿼리 30초 초과. 인덱스 추가로 해결." },
    { id:"EL012", dt:"2026-02-22 14:02:55", errType:"권한 오류",   module:"사용자관리",  msg:"타 기관 사용자 정보 조회 시도",            user:"orgadmin",  reqUrl:"/api/admin/users/ORG002",   status:"처리 완료", detail:"기관 관리자가 타 기관 사용자 조회 시도. 403 반환." },
  ];

  const [logs,     setLogs]     = useState(INIT_LOGS);
  const [keyword,  setKeyword]  = useState("");
  const [dateFrom, setDateFrom] = useState("2026-02-22");
  const [dateTo,   setDateTo]   = useState("2026-02-24");
  const [errType,  setErrType]  = useState("전체");
  const [module,   setModule]   = useState("전체");
  const [stFilter, setStFilter] = useState("전체");
  const [page,     setPage]     = useState(1);
  const [selLog,   setSelLog]   = useState(null);

  const filtered = logs.filter(l => {
    const kw = keyword.trim().toLowerCase();
    if (kw && !l.msg.toLowerCase().includes(kw) && !l.user.toLowerCase().includes(kw) && !l.module.toLowerCase().includes(kw)) return false;
    if (errType  !== "전체" && l.errType !== errType)    return false;
    if (module   !== "전체" && l.module  !== module)     return false;
    if (stFilter !== "전체" && l.status  !== stFilter)   return false;
    if (dateFrom && l.dt.slice(0,10) < dateFrom) return false;
    if (dateTo   && l.dt.slice(0,10) > dateTo)   return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SZ));
  const paged      = filtered.slice((page-1)*PAGE_SZ, page*PAGE_SZ);
  const search = () => setPage(1);
  const reset  = () => { setKeyword(""); setDateFrom("2026-02-22"); setDateTo("2026-02-24"); setErrType("전체"); setModule("전체"); setStFilter("전체"); setPage(1); };

  const TypeBadge = ({ v }) => {
    const s = TYPE_STYLE[v] || { bg:"#F9FAFC", c:"#929292" };
    return <span style={{ padding:"2px 9px", borderRadius:10, fontSize:11, fontWeight:700, background:s.bg, color:s.c, whiteSpace:"nowrap" }}>{v}</span>;
  };
  const StBadge = ({ v, clickable, onCk }) => {
    const s = STATUS_STYLE[v] || { bg:"#F9FAFC", c:"#64748b", border:"#e2e8f0" };
    return <span onClick={onCk} title={clickable ? "클릭하여 상태 변경" : undefined}
      style={{ padding:"3px 10px", borderRadius:10, fontSize:11, fontWeight:700,
        background:s.bg, color:s.c, border:`1px solid ${s.border}`,
        cursor: clickable ? "pointer" : "default", whiteSpace:"nowrap" }}>{v}</span>;
  };

  const STATUS_CYCLE = { "미처리":"처리 중", "처리 중":"처리 완료", "처리 완료":"미처리" };
  const cycleStatus = (id, e) => {
    e.stopPropagation();
    setLogs(prev => prev.map(l => l.id===id ? {...l, status:STATUS_CYCLE[l.status]} : l));
    setSelLog(prev => prev?.id===id ? {...prev, status:STATUS_CYCLE[prev.status]} : prev);
  };

  const unhandled = logs.filter(l => l.status === "미처리").length;

  return (
    <div>
      <PH title="에러로그" bc="홈 > 로그정보 > 에러로그" />
      <div>

        {/* ── 검색 영역 (searchform) ── */}
        <div style={{ width: "100%", border: `1px solid ${C.brd}`, background: C.bg, borderRadius: 6, padding: "12px", display: "flex", gap: 8, marginBottom: 16, alignItems: "stretch" }}>
          <div style={{ display: "flex", flex: 1, gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.txL }}>키워드</span>
              <input value={keyword} onChange={e=>setKeyword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()}
                placeholder="오류 메시지, 사용자, 모듈" style={{ padding: "6px 12px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, outline: "none", color: C.txt, background: "#fff", height: 36, width: 180, fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.txL }}>기간</span>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} style={{ padding: "6px 10px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, outline: "none", color: C.txt, background: "#fff", height: 36, fontFamily: "inherit", boxSizing: "border-box" }} />
                <span style={{ color: C.txL, fontSize: 12 }}>~</span>
                <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} style={{ padding: "6px 10px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, outline: "none", color: C.txt, background: "#fff", height: 36, fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.txL }}>오류유형</span>
              <select value={errType} onChange={e=>setErrType(e.target.value)} style={{ padding: "6px 10px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, background: "#fff", color: C.txt, height: 36, fontFamily: "inherit", boxSizing: "border-box" }}>
                {ERR_TYPES.map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.txL }}>발생모듈</span>
              <select value={module} onChange={e=>setModule(e.target.value)} style={{ padding: "6px 10px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, background: "#fff", color: C.txt, height: 36, fontFamily: "inherit", boxSizing: "border-box" }}>
                {MODULES.map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.txL }}>처리상태</span>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                {["전체", ...STATUSES].map(v => {
                  const s = STATUS_STYLE[v];
                  const active = stFilter === v;
                  return (
                    <button key={v} onClick={()=>{ setStFilter(v); setPage(1); }}
                      style={{ padding:"4px 13px", borderRadius:16, fontSize:12, fontWeight:600, cursor:"pointer",
                        border: active ? `1px solid ${s ? s.border : C.pri}` : `1px solid ${C.brd}`,
                        background: active ? (s ? s.bg : C.pri) : "#fff",
                        color: active ? (s ? s.c : "#fff") : C.txS }}>
                      {v}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={search} style={{ background: "#fff", border: `1px solid ${C.sec}`, color: C.sec, borderRadius: 4, padding: "0 24px", fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", height: 36, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s" }}
              onMouseEnter={e => { e.currentTarget.style.background = C.sec; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = C.sec; }}>검색</button>
            <button onClick={reset} title="검색 초기화" style={{ background: C.priL, border: `1px solid ${C.pri}40`, borderRadius: 4, padding: "0 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", height: 36, boxSizing: "border-box" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 2v4h-4" stroke={C.pri} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.5 10a6 6 0 11-1.3-6.3L14 6" stroke={C.pri} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>

        {/* sec-title */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingTop: 38, paddingBottom: 8, borderBottom: `1px solid ${C.brdD}`, marginBottom: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: C.txH }}>에러 이력</span>
            <span style={{ fontSize: 12, color: C.txL }}>{filtered.length}건</span>
            {unhandled > 0 && (
              <span style={{ fontSize:12, color:"#dc2626", background:"#fee2e2", borderRadius:10, padding:"1px 8px", fontWeight:700, border:"1px solid #fca5a5" }}>
                미처리 {unhandled}건
              </span>
            )}
          </div>
          <span style={{ fontSize:11, color:C.txL }}>처리 상태 배지를 클릭하면 상태를 변경할 수 있습니다.</span>
        </div>

          <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: "100%", width: "max-content", borderCollapse: "collapse", fontSize: 15, borderBottom: `1px solid ${C.brd}` }}>
            <thead>
              <tr style={{ borderTop: `1px solid ${C.txH}` }}>
                {[["No.",70],["오류 유형",110],["발생 모듈",100],["오류 메시지","auto"],["사용자",80],["발생 일시",150],["처리 상태",95]].map(([h,w],i)=>(
                  <th key={i} style={{ padding:"9px 12px", borderBottom:`1px solid ${C.brdD}`, textAlign:"center", fontSize: 14, fontWeight: 400, color: C.txL, whiteSpace:"nowrap", verticalAlign:"middle" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((l, idx) => (
                <tr key={l.id} onClick={()=>setSelLog(l)}
                  style={{ cursor:"pointer" }}
                  onMouseEnter={e=>e.currentTarget.style.background=C.secL}
                  onMouseLeave={e=>e.currentTarget.style.background=""}>
                  <td style={{ padding:"11px 12px", borderBottom:`1px solid ${C.brd}`, textAlign:"center", verticalAlign:"middle", color:C.txL, fontSize:12 }}>{(page-1)*PAGE_SZ+idx+1}</td>
                  <td style={{ padding:"11px 12px", borderBottom:`1px solid ${C.brd}`, textAlign:"center", verticalAlign:"middle" }}><TypeBadge v={l.errType} /></td>
                  <td style={{ padding:"11px 12px", borderBottom:`1px solid ${C.brd}`, textAlign:"center", verticalAlign:"middle", color:C.txt, fontSize:13 }}>{l.module}</td>
                  <td style={{ padding:"11px 12px", borderBottom:`1px solid ${C.brd}`, textAlign:"center", verticalAlign:"middle", color:C.txt, maxWidth:260 }}>
                    <div style={{ overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{l.msg}</div>
                  </td>
                  <td style={{ padding:"11px 12px", borderBottom:`1px solid ${C.brd}`, textAlign:"center", verticalAlign:"middle", color:C.txt, fontSize:13 }}>{l.user}</td>
                  <td style={{ padding:"11px 12px", borderBottom:`1px solid ${C.brd}`, textAlign:"center", verticalAlign:"middle", color:C.txt, fontFamily:"monospace", fontSize:13 }}>{l.dt}</td>
                  <td style={{ padding:"11px 12px", borderBottom:`1px solid ${C.brd}`, textAlign:"center", verticalAlign:"middle" }}>
                    <StBadge v={l.status} clickable onCk={(e)=>cycleStatus(l.id,e)} />
                  </td>
                </tr>
              ))}
              {!paged.length && (
                <tr><td colSpan={7} style={{ padding:48, textAlign:"center", color:C.txL, fontSize:13 }}>조회된 에러 로그가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
          </div>

          <GuiPag page={page} totalPages={totalPages} setPage={setPage} />
      </div>

      {/* ── 상세 사이드 패널 ── */}
      <SidePanel open={!!selLog} onClose={()=>setSelLog(null)} title="에러 로그 상세" width={480}>
        {selLog && (
          <>
            {/* 오류 정보 */}
            <SecTitle label="오류 정보" primary />
            <div style={{ background:"#f8fafc", borderRadius:8, border:`1px solid ${C.brd}`, overflow:"hidden", marginBottom:20 }}>
              {[
                ["오류 유형", <TypeBadge v={selLog.errType} />, false],
                ["발생 모듈", selLog.module,                    false],
                ["사용자",   selLog.user,                      false],
                ["발생 일시", selLog.dt,                       true],
                ["요청 URL",  selLog.reqUrl,                   true],
              ].map(([label, val, mono], i, arr)=>(
                <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between",
                  padding:"11px 14px", borderBottom:i<arr.length-1?`1px solid ${C.brd}`:"none", fontSize:12 }}>
                  <span style={{ color:C.txS, flexShrink:0, minWidth:72 }}>{label}</span>
                  <span style={{ color:C.txt, fontWeight:500, fontFamily:mono?"monospace":"inherit",
                    fontSize:mono?11:13, textAlign:"right", wordBreak:"break-all" }}>{val}</span>
                </div>
              ))}
            </div>

            {/* 오류 메시지 */}
            <SecTitle label="오류 메시지" primary />
            <div style={{ background:"#fff0f0", border:"1px solid #fecaca", borderRadius:8, padding:"12px 14px", marginBottom:20 }}>
              <p style={{ margin:0, fontSize:13, color:"#991b1b", fontWeight:600, lineHeight:1.6 }}>{selLog.msg}</p>
            </div>

            {/* 상세 내용 */}
            <SecTitle label="상세 내용" primary />
            <div style={{ background:"#f8fafc", border:`1px solid ${C.brd}`, borderRadius:8, padding:"12px 14px", marginBottom:20 }}>
              <p style={{ margin:0, fontSize:12, color:C.txS, lineHeight:1.8 }}>{selLog.detail}</p>
            </div>

            {/* 처리 상태 변경 */}
            <SecTitle label="처리 상태" primary />
            <div style={{ display:"flex", gap:8, marginBottom:24 }}>
              {STATUSES.map(s => {
                const st = STATUS_STYLE[s];
                const active = selLog.status === s;
                return (
                  <button key={s} onClick={()=>{
                    setLogs(prev=>prev.map(l=>l.id===selLog.id?{...l,status:s}:l));
                    setSelLog(prev=>({...prev,status:s}));
                  }} style={{ flex:1, padding:"10px 0", borderRadius:8, fontSize:13, fontWeight:700, cursor:"pointer",
                    border: active ? `2px solid ${st.c}` : `1px solid ${C.brd}`,
                    background: active ? st.bg : "#fff",
                    color: active ? st.c : C.txL,
                    transition:"all .15s" }}>
                    {s}
                  </button>
                );
              })}
            </div>

            <PanelFooter onCancel={()=>setSelLog(null)} onSave={()=>setSelLog(null)} saveLabel="확인" />
          </>
        )}
      </SidePanel>
    </div>
  );
};

/* ── 접속 로그 ── */
const MgrAccessLog = () => {

  /* ── 샘플 데이터 ── */
  const INIT_LOGS = [
    { id: "LOG0001", userId: "admin",    userNm: "홍길동",  dt: "2026-02-24 09:12:33", ip: "192.168.1.10",  result: "성공", path: "웹" },
    { id: "LOG0002", userId: "jdoe",     userNm: "김영희",  dt: "2026-02-24 09:15:01", ip: "192.168.1.22",  result: "성공", path: "웹" },
    { id: "LOG0003", userId: "sysmgr",   userNm: "이철수",  dt: "2026-02-24 09:20:45", ip: "10.0.0.5",      result: "실패", path: "웹" },
    { id: "LOG0004", userId: "inspector",userNm: "박민준",  dt: "2026-02-24 10:03:17", ip: "192.168.2.100", result: "성공", path: "모바일" },
    { id: "LOG0005", userId: "jdoe",     userNm: "김영희",  dt: "2026-02-24 10:44:59", ip: "192.168.1.22",  result: "성공", path: "웹" },
    { id: "LOG0006", userId: "sysmgr",   userNm: "이철수",  dt: "2026-02-24 10:45:03", ip: "10.0.0.5",      result: "실패", path: "웹" },
    { id: "LOG0007", userId: "sysmgr",   userNm: "이철수",  dt: "2026-02-24 10:45:21", ip: "10.0.0.5",      result: "실패", path: "웹" },
    { id: "LOG0008", userId: "admin",    userNm: "홍길동",  dt: "2026-02-24 11:08:42", ip: "192.168.1.10",  result: "성공", path: "웹" },
    { id: "LOG0009", userId: "inspector",userNm: "박민준",  dt: "2026-02-24 12:30:00", ip: "192.168.2.100", result: "성공", path: "모바일" },
    { id: "LOG0010", userId: "maint01",  userNm: "최유지",  dt: "2026-02-24 13:01:55", ip: "172.16.0.8",    result: "성공", path: "웹" },
    { id: "LOG0011", userId: "jdoe",     userNm: "김영희",  dt: "2026-02-24 14:22:10", ip: "192.168.1.22",  result: "성공", path: "웹" },
    { id: "LOG0012", userId: "unknown",  userNm: "—",       dt: "2026-02-24 14:33:07", ip: "203.0.113.42",  result: "실패", path: "웹" },
    { id: "LOG0013", userId: "unknown",  userNm: "—",       dt: "2026-02-24 14:33:19", ip: "203.0.113.42",  result: "실패", path: "웹" },
    { id: "LOG0014", userId: "unknown",  userNm: "—",       dt: "2026-02-24 14:33:31", ip: "203.0.113.42",  result: "실패", path: "웹" },
    { id: "LOG0015", userId: "maint01",  userNm: "최유지",  dt: "2026-02-24 15:10:44", ip: "172.16.0.8",    result: "성공", path: "웹" },
    { id: "LOG0016", userId: "admin",    userNm: "홍길동",  dt: "2026-02-23 08:55:12", ip: "192.168.1.10",  result: "성공", path: "웹" },
    { id: "LOG0017", userId: "inspector",userNm: "박민준",  dt: "2026-02-23 09:40:38", ip: "192.168.2.100", result: "성공", path: "모바일" },
    { id: "LOG0018", userId: "sysmgr",   userNm: "이철수",  dt: "2026-02-23 11:20:05", ip: "10.0.0.5",      result: "성공", path: "웹" },
    { id: "LOG0019", userId: "jdoe",     userNm: "김영희",  dt: "2026-02-22 09:05:50", ip: "192.168.1.22",  result: "성공", path: "웹" },
    { id: "LOG0020", userId: "admin",    userNm: "홍길동",  dt: "2026-02-22 16:30:00", ip: "192.168.1.10",  result: "성공", path: "웹" },
  ];

  const TODAY    = "2026-02-24";
  const PAGE_SZ  = 10;

  const [logs]        = useState(INIT_LOGS);
  const [keyword,  setKeyword]  = useState("");
  const [dateFrom, setDateFrom] = useState("2026-02-22");
  const [dateTo,   setDateTo]   = useState(TODAY);
  const [result,   setResult]   = useState("전체");   // 전체 | 성공 | 실패
  const [path,     setPath]     = useState("전체");   // 전체 | 웹 | 모바일
  const [page,     setPage]     = useState(1);
  const [selLog,   setSelLog]   = useState(null);

  /* ── 필터 적용 ── */
  const filtered = logs.filter(l => {
    const kw = keyword.trim().toLowerCase();
    if (kw && !l.userId.toLowerCase().includes(kw) && !l.userNm.includes(kw) && !l.ip.includes(kw)) return false;
    if (result !== "전체" && l.result !== result) return false;
    if (path   !== "전체" && l.path   !== path)   return false;
    if (dateFrom && l.dt.slice(0, 10) < dateFrom) return false;
    if (dateTo   && l.dt.slice(0, 10) > dateTo)   return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SZ));
  const paged = filtered.slice((page - 1) * PAGE_SZ, page * PAGE_SZ);

  const search = () => setPage(1);
  const reset  = () => { setKeyword(""); setDateFrom("2026-02-22"); setDateTo(TODAY); setResult("전체"); setPath("전체"); setPage(1); };

  /* ── 결과 배지 ── */
  const ResultBadge = ({ v }) => (
    <span style={{ padding: "2px 10px", borderRadius: 10, fontSize: 11, fontWeight: 700,
      background: v === "성공" ? "#dcfce7" : "#fee2e2",
      color:      v === "성공" ? "#16a34a" : "#dc2626" }}>{v}</span>
  );

  /* ── 경로 배지 ── */
  const PathBadge = ({ v }) => (
    <span style={{ padding: "2px 9px", borderRadius: 10, fontSize: 11, fontWeight: 600,
      background: v === "모바일" ? "#ede9fe" : C.priL,
      color:      v === "모바일" ? "#7c3aed" : "#2563eb" }}>{v}</span>
  );


  return (
    <div>
      <PH title="접속로그" bc="홈 > 로그정보 > 접속로그" />

      <div>

        {/* ── 검색 영역 (searchform) ── */}
        <div style={{ width: "100%", border: `1px solid ${C.brd}`, background: C.bg, borderRadius: 6, padding: "12px", display: "flex", gap: 8, marginBottom: 16, alignItems: "stretch" }}>
          <div style={{ display: "flex", flex: 1, gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.txL }}>사용자/IP</span>
              <input value={keyword} onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && search()}
                placeholder="사용자 ID, 이름, IP"
                style={{ padding: "6px 12px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, outline: "none", color: C.txt, background: "#fff", height: 36, width: 180, fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.txL }}>기간</span>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} style={{ padding: "6px 10px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, outline: "none", color: C.txt, background: "#fff", height: 36, fontFamily: "inherit", boxSizing: "border-box" }} />
                <span style={{ color: C.txL, fontSize: 12 }}>~</span>
                <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} style={{ padding: "6px 10px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, outline: "none", color: C.txt, background: "#fff", height: 36, fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.txL }}>접속결과</span>
              <select value={result} onChange={e => setResult(e.target.value)} style={{ padding: "6px 10px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, background: "#fff", color: C.txt, height: 36, fontFamily: "inherit", boxSizing: "border-box" }}>
                {["전체", "성공", "실패"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.txL }}>접속경로</span>
              <select value={path} onChange={e => setPath(e.target.value)} style={{ padding: "6px 10px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, background: "#fff", color: C.txt, height: 36, fontFamily: "inherit", boxSizing: "border-box" }}>
                {["전체", "웹", "모바일"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={search} style={{ background: "#fff", border: `1px solid ${C.sec}`, color: C.sec, borderRadius: 4, padding: "0 24px", fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", height: 36, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s" }}
              onMouseEnter={e => { e.currentTarget.style.background = C.sec; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = C.sec; }}>검색</button>
            <button onClick={reset} title="검색 초기화" style={{ background: C.priL, border: `1px solid ${C.pri}40`, borderRadius: 4, padding: "0 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", height: 36, boxSizing: "border-box" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 2v4h-4" stroke={C.pri} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.5 10a6 6 0 11-1.3-6.3L14 6" stroke={C.pri} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>

        {/* ── 그리드 ── */}
        <div>

          {/* sec-title */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingTop: 38, paddingBottom: 8, borderBottom: `1px solid ${C.brdD}`, marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: C.txH }}>접속 이력</span>
              <span style={{ fontSize: 12, color: C.txL }}>{filtered.length}건</span>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: "100%", width: "max-content", borderCollapse: "collapse", fontSize: 15, borderBottom: `1px solid ${C.brd}` }}>
            <thead>
              <tr style={{ borderTop: `1px solid ${C.txH}` }}>
                {[["No.", 70], ["사용자 ID", 130], ["사용자명", 100], ["접속 일시", 160], ["접속 IP", 140], ["경로", 90], ["결과", 90]].map(([h, w], i) => (
                  <th key={i} style={{ padding: "9px 12px", borderBottom: `1px solid ${C.brdD}`, textAlign: "center", fontSize: 14, fontWeight: 400, color: C.txL, whiteSpace: "nowrap", verticalAlign: "middle" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.map((l, idx) => (
                <tr key={l.id} onClick={() => setSelLog(l)}
                  style={{ cursor: "pointer" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.secL}
                  onMouseLeave={e => e.currentTarget.style.background = ""}>
                  <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle", color: C.txL, fontSize: 12 }}>{(page - 1) * PAGE_SZ + idx + 1}</td>
                  <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle", fontWeight: 600, color: C.txt, fontFamily: "monospace", fontSize: 13 }}>{l.userId}</td>
                  <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle", color: C.txt }}>{l.userNm}</td>
                  <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle", color: C.txt, fontFamily: "monospace", fontSize: 13 }}>{l.dt}</td>
                  <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle", color: C.txt, fontFamily: "monospace", fontSize: 13 }}>{l.ip}</td>
                  <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle" }}><PathBadge v={l.path} /></td>
                  <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle" }}><ResultBadge v={l.result} /></td>
                </tr>
              ))}
              {!paged.length && (
                <tr><td colSpan={7} style={{ padding: 48, textAlign: "center", color: C.txL, fontSize: 13 }}>조회된 접속 이력이 없습니다.</td></tr>
              )}
            </tbody>
          </table>
          </div>

          <GuiPag page={page} totalPages={totalPages} setPage={setPage} />
        </div>
      </div>

      {/* ══ 상세 패널 ══ */}
      <SidePanel open={!!selLog} onClose={() => setSelLog(null)} title="접속 로그 상세" width={420}>
        {selLog && (() => {
          const userHistory = logs
            .filter(l => l.userId === selLog.userId && l.id !== selLog.id)
            .sort((a, b) => b.dt.localeCompare(a.dt))
            .slice(0, 10);
          return (
            <>
              <SecTitle label="접속 정보" primary />
              <div style={{ background: "#f8fafc", borderRadius: 8, border: `1px solid ${C.brd}`, overflow: "hidden", marginBottom: 20 }}>
                {[
                  ["사용자 ID",  selLog.userId,  true ],
                  ["사용자명",   selLog.userNm,  false],
                  ["접속 일시",  selLog.dt,      true ],
                  ["접속 IP",    selLog.ip,      true ],
                  ["접속 경로",  selLog.path,    false],
                  ["접속 결과",  selLog.result,  false],
                ].map(([label, val, mono], i, arr) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "11px 14px", borderBottom: i < arr.length - 1 ? `1px solid ${C.brd}` : "none", fontSize: 12 }}>
                    <span style={{ color: C.txS, flexShrink: 0 }}>{label}</span>
                    {label === "접속 결과"
                      ? <ResultBadge v={val} />
                      : label === "접속 경로"
                      ? <PathBadge v={val} />
                      : <span style={{ color: C.txt, fontWeight: 500, fontFamily: mono ? "monospace" : "inherit", fontSize: mono ? 12 : 13 }}>{val}</span>
                    }
                  </div>
                ))}
              </div>

              {/* 접속 히스토리 */}
              <SecTitle label={`접속 히스토리 · ${selLog.userId}`} primary />
              {userHistory.length === 0 ? (
                <div style={{ padding: "16px 0", fontSize: 12, color: C.txL, textAlign: "center" }}>다른 접속 이력이 없습니다.</div>
              ) : (
                <div style={{ position: "relative", paddingLeft: 20, marginBottom: 24 }}>
                  {/* 타임라인 세로선 */}
                  <div style={{ position: "absolute", left: 6, top: 6, bottom: 6, width: 2, background: C.brd }} />
                  {userHistory.map((h, i) => (
                    <div key={h.id} style={{ position: "relative", marginBottom: i < userHistory.length - 1 ? 12 : 0 }}>
                      {/* 점 */}
                      <div style={{ position: "absolute", left: -17, top: 4, width: 8, height: 8, borderRadius: "50%",
                        background: h.result === "성공" ? "#16a34a" : "#dc2626",
                        border: "2px solid #fff", boxShadow: "0 0 0 1px #e2e8f0" }} />
                      <div style={{ background: "#f8fafc", border: `1px solid ${C.brd}`, borderRadius: 8, padding: "9px 12px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <ResultBadge v={h.result} />
                          <span style={{ fontSize: 11, color: C.txL, fontFamily: "monospace" }}>{h.dt}</span>
                        </div>
                        <div style={{ fontSize: 12, color: C.txS, display: "flex", gap: 8 }}>
                          <span><span style={{ color: C.txL }}>IP</span> <span style={{ fontFamily: "monospace", color: C.txt }}>{h.ip}</span></span>
                          <span>·</span>
                          <PathBadge v={h.path} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <PanelFooter onCancel={() => setSelLog(null)} onSave={() => setSelLog(null)} saveLabel="확인" />
            </>
          );
        })()}
      </SidePanel>
    </div>
  );
};

/* ── 권한 변경 로그 ── */
const MgrPermLog = () => {
  const INIT_LOGS = [
    { id:"PL001", dt:"2026-02-24 14:30:12", userId:"admin",   userNm:"김시스템", targetId:"jdoe",     targetNm:"김영희", prevRole:"사용자",       nextRole:"유지보수총괄", sysNm:"인사급여시스템",    reason:"업무 변경" },
    { id:"PL002", dt:"2026-02-24 11:20:05", userId:"admin",   userNm:"김시스템", targetId:"inspector", targetNm:"박민준", prevRole:"사용자",       nextRole:"기관관리자",   sysNm:"전자결재시스템",    reason:"관리자 승격" },
    { id:"PL003", dt:"2026-02-23 16:45:33", userId:"admin",   userNm:"김시스템", targetId:"maint01",  targetNm:"최유지", prevRole:"유지보수총괄", nextRole:"사용자",       sysNm:"ERP시스템",        reason:"퇴임 처리" },
    { id:"PL004", dt:"2026-02-23 09:15:22", userId:"admin",   userNm:"김시스템", targetId:"lee01",    targetNm:"이철수", prevRole:"사용자",       nextRole:"유지보수총괄", sysNm:"메일시스템",        reason:"업무 배정" },
    { id:"PL005", dt:"2026-02-22 17:05:41", userId:"admin",   userNm:"김시스템", targetId:"park02",   targetNm:"박지원", prevRole:"기관관리자",   nextRole:"사용자",       sysNm:"인사급여시스템",    reason:"권한 회수" },
    { id:"PL006", dt:"2026-02-22 10:30:55", userId:"mgr01",   userNm:"정관리",  targetId:"kang01",   targetNm:"강하늘", prevRole:"—",            nextRole:"사용자",       sysNm:"전자결재시스템",    reason:"신규 등록" },
    { id:"PL007", dt:"2026-02-21 14:12:08", userId:"admin",   userNm:"김시스템", targetId:"jdoe",     targetNm:"김영희", prevRole:"유지보수총괄", nextRole:"기관관리자",   sysNm:"인사급여시스템",    reason:"역할 변경" },
    { id:"PL008", dt:"2026-02-21 09:45:19", userId:"admin",   userNm:"김시스템", targetId:"choi03",   targetNm:"최민수", prevRole:"사용자",       nextRole:"유지보수총괄", sysNm:"ERP시스템",        reason:"인수인계" },
    { id:"PL009", dt:"2026-02-20 16:22:37", userId:"mgr01",   userNm:"정관리",  targetId:"shin01",   targetNm:"신예린", prevRole:"—",            nextRole:"사용자",       sysNm:"메일시스템",        reason:"신규 등록" },
    { id:"PL010", dt:"2026-02-20 11:08:44", userId:"admin",   userNm:"김시스템", targetId:"lee01",    targetNm:"이철수", prevRole:"유지보수총괄", nextRole:"사용자",       sysNm:"메일시스템",        reason:"업무 해제" },
    { id:"PL011", dt:"2026-02-19 15:33:21", userId:"admin",   userNm:"김시스템", targetId:"park02",   targetNm:"박지원", prevRole:"사용자",       nextRole:"기관관리자",   sysNm:"인사급여시스템",    reason:"관리자 지정" },
    { id:"PL012", dt:"2026-02-19 10:10:50", userId:"admin",   userNm:"김시스템", targetId:"inspector",targetNm:"박민준", prevRole:"기관관리자",   nextRole:"사용자",       sysNm:"전자결재시스템",    reason:"권한 조정" },
  ];

  const PAGE_SZ = 10;
  const [logs] = useState(INIT_LOGS);
  const [keyword, setKeyword] = useState("");
  const [dateFrom, setDateFrom] = useState("2026-02-19");
  const [dateTo, setDateTo] = useState("2026-02-24");
  const [roleFilter, setRoleFilter] = useState("전체");
  const [page, setPage] = useState(1);
  const [selLog, setSelLog] = useState(null);

  const ROLES = ["전체","시스템관리자","기관관리자","유지보수총괄","사용자"];

  const filtered = logs.filter(l => {
    const kw = keyword.trim().toLowerCase();
    if (kw && !l.targetNm.includes(kw) && !l.targetId.toLowerCase().includes(kw) && !l.userNm.includes(kw) && !l.sysNm.includes(kw)) return false;
    if (dateFrom && l.dt.slice(0,10) < dateFrom) return false;
    if (dateTo && l.dt.slice(0,10) > dateTo) return false;
    if (roleFilter !== "전체" && l.prevRole !== roleFilter && l.nextRole !== roleFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SZ));
  const paged = filtered.slice((page-1)*PAGE_SZ, page*PAGE_SZ);
  const search = () => setPage(1);
  const reset = () => { setKeyword(""); setDateFrom("2026-02-19"); setDateTo("2026-02-24"); setRoleFilter("전체"); setPage(1); };

  const RoleBadgeP = ({v}) => {
    const m = { "시스템관리자":["#fee2e2","#dc2626"], "기관관리자":["#dbeafe","#2563eb"], "유지보수총괄":["#f0fdf4","#16a34a"], "사용자":[C.priL,C.pri] };
    const [bg,c] = m[v] || ["#f5f5f5","#888"];
    return <span style={{padding:"2px 9px",borderRadius:10,fontSize:11,fontWeight:600,background:bg,color:c}}>{v}</span>;
  };

  return (
    <div>
      <PH title="권한변경로그" bc="홈 > 로그정보 > 권한변경로그" />
      <div>

        {/* ── 검색 영역 ── */}
        <div style={{ width: "100%", border: `1px solid ${C.brd}`, background: C.bg, borderRadius: 6, padding: "12px", display: "flex", gap: 8, marginBottom: 16, alignItems: "stretch" }}>
          <div style={{ display: "flex", flex: 1, gap: 10, flexWrap: "wrap", alignItems: "flex-end" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.txL }}>사용자/시스템</span>
              <input value={keyword} onChange={e=>setKeyword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&search()}
                placeholder="대상자, 변경자, 시스템명"
                style={{ padding: "6px 12px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, outline: "none", color: C.txt, background: "#fff", height: 36, width: 180, fontFamily: "inherit", boxSizing: "border-box" }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.txL }}>기간</span>
              <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
                <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} style={{ padding: "6px 10px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, outline: "none", color: C.txt, background: "#fff", height: 36, fontFamily: "inherit", boxSizing: "border-box" }} />
                <span style={{ color: C.txL, fontSize: 12 }}>~</span>
                <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} style={{ padding: "6px 10px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, outline: "none", color: C.txt, background: "#fff", height: 36, fontFamily: "inherit", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: C.txL }}>역할</span>
              <select value={roleFilter} onChange={e=>setRoleFilter(e.target.value)} style={{ padding: "6px 10px", border: `1px solid ${C.brd}`, borderRadius: 4, fontSize: 13, background: "#fff", color: C.txt, height: 36, fontFamily: "inherit", boxSizing: "border-box" }}>
                {ROLES.map(v=><option key={v}>{v}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <button onClick={search} style={{ background: "#fff", border: `1px solid ${C.sec}`, color: C.sec, borderRadius: 4, padding: "0 24px", fontSize: 13, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", fontFamily: "inherit", height: 36, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .3s" }}
              onMouseEnter={e => { e.currentTarget.style.background = C.sec; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = C.sec; }}>검색</button>
            <button onClick={reset} title="검색 초기화" style={{ background: C.priL, border: `1px solid ${C.pri}40`, borderRadius: 4, padding: "0 12px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", height: 36, boxSizing: "border-box" }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 2v4h-4" stroke={C.pri} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M13.5 10a6 6 0 11-1.3-6.3L14 6" stroke={C.pri} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>

        {/* sec-title */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingTop: 38, paddingBottom: 8, borderBottom: `1px solid ${C.brdD}`, marginBottom: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: C.txH }}>권한 변경 이력</span>
            <span style={{ fontSize: 12, color: C.txL }}>{filtered.length}건</span>
          </div>
        </div>

        <div style={{ overflowX: "auto" }}>
        <table style={{ minWidth: "100%", width: "max-content", borderCollapse: "collapse", fontSize: 15, borderBottom: `1px solid ${C.brd}` }}>
          <thead>
            <tr style={{ borderTop: `1px solid ${C.txH}` }}>
              {[["No.",70],["변경 일시",160],["대상자 ID",120],["대상자명",100],["변경 전 역할",130],["",30],["변경 후 역할",130],["정보시스템",140],["변경자",100],["사유",120]].map(([h,w],i) => (
                <th key={i} style={{ padding:"9px 12px", borderBottom:`1px solid ${C.brdD}`, textAlign:"center", fontSize:14, fontWeight:400, color:C.txL, whiteSpace:"nowrap", verticalAlign:"middle" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paged.map((l,idx) => (
              <tr key={l.id} onClick={()=>setSelLog(l)} style={{cursor:"pointer"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.secL}
                onMouseLeave={e=>e.currentTarget.style.background=""}>
                <td style={{padding:"11px 12px",borderBottom:`1px solid ${C.brd}`,textAlign:"center",fontSize:13,color:C.txL,verticalAlign:"middle"}}>{(page-1)*PAGE_SZ+idx+1}</td>
                <td style={{padding:"11px 12px",borderBottom:`1px solid ${C.brd}`,textAlign:"center",fontSize:13,color:C.txt,verticalAlign:"middle"}}>{l.dt}</td>
                <td style={{padding:"11px 12px",borderBottom:`1px solid ${C.brd}`,textAlign:"center",fontFamily:"monospace",fontSize:13,color:C.txS,verticalAlign:"middle"}}>{l.targetId}</td>
                <td style={{padding:"11px 12px",borderBottom:`1px solid ${C.brd}`,textAlign:"center",fontWeight:600,color:C.pri,verticalAlign:"middle"}}>{l.targetNm}</td>
                <td style={{padding:"11px 12px",borderBottom:`1px solid ${C.brd}`,textAlign:"center",verticalAlign:"middle"}}>{l.prevRole==="—"?<span style={{color:C.txL}}>—</span>:<RoleBadgeP v={l.prevRole}/>}</td>
                <td style={{padding:"11px 12px",borderBottom:`1px solid ${C.brd}`,textAlign:"center",verticalAlign:"middle",color:C.txL,fontSize:16}}>→</td>
                <td style={{padding:"11px 12px",borderBottom:`1px solid ${C.brd}`,textAlign:"center",verticalAlign:"middle"}}><RoleBadgeP v={l.nextRole}/></td>
                <td style={{padding:"11px 12px",borderBottom:`1px solid ${C.brd}`,textAlign:"center",fontSize:13,color:C.txt,verticalAlign:"middle"}}>{l.sysNm}</td>
                <td style={{padding:"11px 12px",borderBottom:`1px solid ${C.brd}`,textAlign:"center",fontSize:13,color:C.txS,verticalAlign:"middle"}}>{l.userNm}</td>
                <td style={{padding:"11px 12px",borderBottom:`1px solid ${C.brd}`,textAlign:"center",fontSize:13,color:C.txS,verticalAlign:"middle"}}>{l.reason}</td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr><td colSpan={10} style={{padding:48,textAlign:"center",color:C.txL,fontSize:13}}>권한 변경 이력이 없습니다.</td></tr>
            )}
          </tbody>
        </table>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div style={{display:"flex",justifyContent:"center",gap:4,padding:"16px 0"}}>
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1}
              style={{padding:"6px 10px",fontSize:13,border:`1px solid ${C.brd}`,borderRadius:4,background:"#fff",color:page===1?C.txL:C.txt,cursor:page===1?"default":"pointer"}}>‹</button>
            {Array.from({length:totalPages},(_,i)=>i+1).map(p=>(
              <button key={p} onClick={()=>setPage(p)}
                style={{padding:"6px 10px",fontSize:13,border:`1px solid ${page===p?C.sec:C.brd}`,borderRadius:4,background:page===p?C.sec:"#fff",color:page===p?"#fff":C.txt,cursor:"pointer",fontWeight:page===p?700:400}}>{p}</button>
            ))}
            <button onClick={()=>setPage(p=>Math.min(totalPages,p+1))} disabled={page===totalPages}
              style={{padding:"6px 10px",fontSize:13,border:`1px solid ${C.brd}`,borderRadius:4,background:"#fff",color:page===totalPages?C.txL:C.txt,cursor:page===totalPages?"default":"pointer"}}>›</button>
          </div>
        )}

        {/* 오른쪽 상세 패널 */}
        <div style={{position:"fixed",top:67,right:0,width:selLog?420:0,height:"calc(100% - 67px)",background:"#fff",zIndex:300,boxShadow:selLog?"-4px 0 20px rgba(0,0,0,.12)":"none",transition:"width .3s ease",overflow:"hidden",display:"flex",flexDirection:"column"}}>
          {selLog && <>
            <div style={{padding:"20px 24px",borderBottom:`1px solid ${C.brd}`,display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
              <span style={{fontSize:18,fontWeight:700,color:C.txH}}>권한 변경 상세</span>
              <button onClick={()=>setSelLog(null)} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.txL}}>×</button>
            </div>
            <div style={{flex:1,overflowY:"auto",padding:"20px 24px"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:14}}>
                <tbody>
                  {[
                    ["변경 일시", selLog.dt],
                    ["대상자 ID", <span key="tid" style={{fontFamily:"monospace"}}>{selLog.targetId}</span>],
                    ["대상자명", <span key="tnm" style={{fontWeight:600,color:C.pri}}>{selLog.targetNm}</span>],
                    ["변경 전 역할", selLog.prevRole==="—"?<span key="pr" style={{color:C.txL}}>—</span>:<RoleBadgeP key="prb" v={selLog.prevRole}/>],
                    ["변경 후 역할", <RoleBadgeP key="nrb" v={selLog.nextRole}/>],
                    ["정보시스템", selLog.sysNm],
                    ["변경자", `${selLog.userNm} (${selLog.userId})`],
                    ["사유", selLog.reason],
                  ].map(([k,v],i) => (
                    <tr key={i}>
                      <td style={{padding:"10px 0",fontWeight:600,color:C.txS,width:110,verticalAlign:"top",fontSize:13}}>{k}</td>
                      <td style={{padding:"10px 0",color:C.txt}}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>}
        </div>

      </div>
    </div>
  );
};

/* ── 시스템 코드 관리 ── */
const MgrSysCode = () => {

  const INIT_GROUPS = [
    { id:"SYS_AGENT_TYPE",  nm:"에이전트 타입",   desc:"자동점검 수행에 필요한 에이전트 종류 코드",     cnt:5, useYn:"Y", regDt:"2026-01-05" },
    { id:"SYS_FREQ_TYPE",   nm:"점검 주기 유형",   desc:"정기점검 스케줄 반복 주기 유형 코드",           cnt:3, useYn:"Y", regDt:"2026-01-05" },
    { id:"SYS_LOG_TYPE",    nm:"로그 유형",         desc:"시스템 로그 분류 코드",                         cnt:4, useYn:"Y", regDt:"2026-01-05" },
    { id:"SYS_NOTIFY_CH",   nm:"알림 채널",         desc:"알림 발송 경로 코드",                           cnt:3, useYn:"Y", regDt:"2026-01-06" },
    { id:"SYS_RES_CAT",     nm:"자원 대분류",       desc:"자원 대분류 코드 (HW/SW/NW 등)",               cnt:4, useYn:"Y", regDt:"2026-01-06" },
    { id:"SYS_OS_TYPE",     nm:"OS 유형",           desc:"자원에 설치된 운영체제 유형 코드",              cnt:6, useYn:"Y", regDt:"2026-01-07" },
    { id:"SYS_ERR_TYPE",    nm:"에러 유형",         desc:"시스템 에러 로그 분류 기준 코드",               cnt:5, useYn:"Y", regDt:"2026-01-08" },
    { id:"SYS_AUTH_ACTION", nm:"권한 변경 유형",    desc:"권한 변경 이력 이벤트 유형 코드",              cnt:4, useYn:"Y", regDt:"2026-01-10" },
    { id:"SYS_BATCH_ST",    nm:"배치 상태",         desc:"배치 작업 실행 상태 코드",                     cnt:4, useYn:"Y", regDt:"2026-01-12" },
    { id:"SYS_SNMP_VER",    nm:"SNMP 버전",         desc:"네트워크 장비 모니터링 SNMP 버전 코드",         cnt:3, useYn:"N", regDt:"2026-01-15" },
  ];

  const INIT_CODES = {
    SYS_AGENT_TYPE: [
      { id:"SA001", grpId:"SYS_AGENT_TYPE", cd:"SSH",   nm:"SSH Agent",    desc:"SSH 프로토콜 기반 점검 에이전트",      sort:1, useYn:"Y", regDt:"2026-01-05" },
      { id:"SA002", grpId:"SYS_AGENT_TYPE", cd:"SNMP",  nm:"SNMP Agent",   desc:"SNMP 프로토콜 기반 점검 에이전트",     sort:2, useYn:"Y", regDt:"2026-01-05" },
      { id:"SA003", grpId:"SYS_AGENT_TYPE", cd:"WEB",   nm:"Web Agent",    desc:"HTTP/HTTPS 기반 서비스 점검 에이전트", sort:3, useYn:"Y", regDt:"2026-01-05" },
      { id:"SA004", grpId:"SYS_AGENT_TYPE", cd:"DB",    nm:"DB Agent",     desc:"데이터베이스 직접 접속 점검 에이전트", sort:4, useYn:"Y", regDt:"2026-01-05" },
      { id:"SA005", grpId:"SYS_AGENT_TYPE", cd:"LOCAL", nm:"Local Agent",  desc:"로컬 설치형 에이전트",                sort:5, useYn:"Y", regDt:"2026-01-05" },
    ],
    SYS_FREQ_TYPE: [
      { id:"SF001", grpId:"SYS_FREQ_TYPE", cd:"DAILY",   nm:"일 주기",  desc:"매일 반복 수행",  sort:1, useYn:"Y", regDt:"2026-01-05" },
      { id:"SF002", grpId:"SYS_FREQ_TYPE", cd:"WEEKLY",  nm:"주 주기",  desc:"매주 반복 수행",  sort:2, useYn:"Y", regDt:"2026-01-05" },
      { id:"SF003", grpId:"SYS_FREQ_TYPE", cd:"MONTHLY", nm:"월 주기",  desc:"매월 반복 수행",  sort:3, useYn:"Y", regDt:"2026-01-05" },
    ],
    SYS_LOG_TYPE: [
      { id:"SL001", grpId:"SYS_LOG_TYPE", cd:"ACCESS",   nm:"접속 로그", desc:"사용자 로그인/아웃 이력",    sort:1, useYn:"Y", regDt:"2026-01-05" },
      { id:"SL002", grpId:"SYS_LOG_TYPE", cd:"RESOURCE", nm:"자원 로그", desc:"자원 변경 이력",             sort:2, useYn:"Y", regDt:"2026-01-05" },
      { id:"SL003", grpId:"SYS_LOG_TYPE", cd:"INSPECT",  nm:"점검 로그", desc:"점검 수행 이력",             sort:3, useYn:"Y", regDt:"2026-01-05" },
      { id:"SL004", grpId:"SYS_LOG_TYPE", cd:"ERROR",    nm:"에러 로그", desc:"시스템 오류 및 예외 이벤트", sort:4, useYn:"Y", regDt:"2026-01-05" },
    ],
    SYS_NOTIFY_CH: [
      { id:"SN001", grpId:"SYS_NOTIFY_CH", cd:"EMAIL", nm:"이메일", desc:"이메일 알림 발송",   sort:1, useYn:"Y", regDt:"2026-01-06" },
      { id:"SN002", grpId:"SYS_NOTIFY_CH", cd:"SMS",   nm:"SMS",    desc:"SMS 문자 알림 발송", sort:2, useYn:"Y", regDt:"2026-01-06" },
      { id:"SN003", grpId:"SYS_NOTIFY_CH", cd:"PUSH",  nm:"푸시",   desc:"모바일 푸시 알림",   sort:3, useYn:"Y", regDt:"2026-01-06" },
    ],
    SYS_OS_TYPE: [
      { id:"SO001", grpId:"SYS_OS_TYPE", cd:"RHEL",    nm:"RHEL",           desc:"Red Hat Enterprise Linux",     sort:1, useYn:"Y", regDt:"2026-01-07" },
      { id:"SO002", grpId:"SYS_OS_TYPE", cd:"CENTOS",  nm:"CentOS",         desc:"CentOS Linux",                 sort:2, useYn:"Y", regDt:"2026-01-07" },
      { id:"SO003", grpId:"SYS_OS_TYPE", cd:"UBUNTU",  nm:"Ubuntu",         desc:"Ubuntu Server",                sort:3, useYn:"Y", regDt:"2026-01-07" },
      { id:"SO004", grpId:"SYS_OS_TYPE", cd:"WIN_SVR", nm:"Windows Server", desc:"Microsoft Windows Server",     sort:4, useYn:"Y", regDt:"2026-01-07" },
      { id:"SO005", grpId:"SYS_OS_TYPE", cd:"AIX",     nm:"AIX",            desc:"IBM AIX",                      sort:5, useYn:"Y", regDt:"2026-01-07" },
      { id:"SO006", grpId:"SYS_OS_TYPE", cd:"SOLARIS", nm:"Solaris",        desc:"Oracle Solaris",               sort:6, useYn:"N", regDt:"2026-01-07" },
    ],
  };

  const EMPTY_GRP  = { id:"", nm:"", desc:"", useYn:"Y" };
  const EMPTY_CODE = { id:"", cd:"", nm:"", desc:"", sort:1, useYn:"Y" };

  const [groups,       setGroups]        = useState(INIT_GROUPS);
  const [codes,        setCodes]         = useState(INIT_CODES);
  const [selGrp,       setSelGrp]        = useState(INIT_GROUPS[0]);
  const [grpQ,         setGrpQ]          = useState("");
  const [grpUseFilter, setGrpUseFilter]  = useState("전체");
  const [codeQ,        setCodeQ]         = useState("");
  const [codeUseFilter,setCodeUseFilter] = useState("전체");

  const [grpPanel,   setGrpPanel]   = useState(false);
  const [grpForm,    setGrpForm]    = useState(EMPTY_GRP);
  const [grpIsNew,   setGrpIsNew]   = useState(false);
  const [grpErrors,  setGrpErrors]  = useState({});
  const [grpDel,     setGrpDel]     = useState(null);

  const [codePanel,  setCodePanel]  = useState(false);
  const [codeForm,   setCodeForm]   = useState(EMPTY_CODE);
  const [codeIsNew,  setCodeIsNew]  = useState(false);
  const [codeErrors, setCodeErrors] = useState({});
  const [codeDel,    setCodeDel]    = useState(null);

  const sgf = (k,v) => setGrpForm(p=>({...p,[k]:v}));
  const scf = (k,v) => setCodeForm(p=>({...p,[k]:v}));

  const filteredGroups = groups.filter(g => {
    if (grpUseFilter !== "전체" && g.useYn !== (grpUseFilter==="사용"?"Y":"N")) return false;
    if (grpQ && !g.nm.includes(grpQ) && !g.id.toLowerCase().includes(grpQ.toLowerCase())) return false;
    return true;
  });

  const curCodes = (codes[selGrp?.id]||[])
    .filter(c => {
      if (codeUseFilter !== "전체" && c.useYn !== (codeUseFilter==="사용"?"Y":"N")) return false;
      if (codeQ && !c.nm.includes(codeQ) && !c.cd.toLowerCase().includes(codeQ.toLowerCase())) return false;
      return true;
    })
    .sort((a,b) => a.sort - b.sort);

  const openGrpPanel = (g, isNew=false) => {
    setGrpIsNew(isNew); setGrpForm(isNew ? EMPTY_GRP : {...g}); setGrpErrors({}); setGrpPanel(true);
  };
  const openCodePanel = (c, isNew=false) => {
    setCodeIsNew(isNew);
    setCodeForm(isNew ? {...EMPTY_CODE, sort:(codes[selGrp?.id]||[]).length+1} : {...c});
    setCodeErrors({}); setCodePanel(true);
  };

  const saveGroup = () => {
    const e = {};
    if (!grpForm.id.trim()) e.id = "그룹 ID를 입력하세요.";
    if (!grpForm.nm.trim()) e.nm = "그룹명을 입력하세요.";
    if (grpIsNew && groups.some(g=>g.id===grpForm.id.trim())) e.id = "이미 존재하는 그룹 ID입니다.";
    setGrpErrors(e);
    if (Object.keys(e).length) return;
    if (grpIsNew) {
      setGroups(p=>[...p, {...grpForm, id:grpForm.id.trim().toUpperCase(), cnt:0, regDt:"2026-02-24"}]);
    } else {
      setGroups(p=>p.map(g=>g.id===grpForm.id ? {...g,...grpForm} : g));
      if (selGrp?.id===grpForm.id) setSelGrp(prev=>({...prev,...grpForm}));
    }
    setGrpPanel(false);
  };

  const saveCode = () => {
    const e = {};
    if (!codeForm.cd.trim()) e.cd = "코드값을 입력하세요.";
    if (!codeForm.nm.trim()) e.nm = "코드명을 입력하세요.";
    if (codeIsNew && (codes[selGrp?.id]||[]).some(c=>c.cd===codeForm.cd.trim().toUpperCase())) e.cd = "동일 그룹 내 중복 코드값입니다.";
    setCodeErrors(e);
    if (Object.keys(e).length) return;
    if (codeIsNew) {
      const nc = {...codeForm, cd:codeForm.cd.trim().toUpperCase(), id:`${selGrp.id}_${Date.now()}`, grpId:selGrp.id, regDt:"2026-02-24"};
      setCodes(p=>({...p, [selGrp.id]:[...(p[selGrp.id]||[]), nc]}));
      setGroups(p=>p.map(g=>g.id===selGrp.id ? {...g, cnt:g.cnt+1} : g));
    } else {
      setCodes(p=>({...p, [selGrp.id]: p[selGrp.id].map(c=>c.id===codeForm.id ? {...c,...codeForm} : c)}));
    }
    setCodePanel(false);
  };

  const deleteGroup = (id) => {
    const grp = groups.find(g=>g.id===id);
    if (grp?.cnt > 0) { alert("하위 코드가 있는 그룹은 삭제할 수 없습니다. 코드를 먼저 삭제하거나 미사용 처리하세요."); setGrpDel(null); return; }
    setGroups(p=>p.filter(g=>g.id!==id));
    if (selGrp?.id===id) setSelGrp(groups.find(g=>g.id!==id)||null);
    setGrpDel(null); setGrpPanel(false);
  };
  const deleteCode = (cid) => {
    setCodes(p=>({...p, [selGrp.id]:(p[selGrp.id]||[]).filter(c=>c.id!==cid)}));
    setGroups(p=>p.map(g=>g.id===selGrp.id ? {...g, cnt:Math.max(0,g.cnt-1)} : g));
    setCodeDel(null); setCodePanel(false);
  };

  const inp = {...fInput};
  const ro  = {background:"#f0f1f3", color:C.txS, pointerEvents:"none"};
  const err = (msg) => msg ? <div style={{fontSize:11,color:"#ef4444",marginTop:3}}>{msg}</div> : null;

  const UseRadio = ({val, onChange}) => (
    <div style={{display:"flex",gap:16}}>
      {[["Y","사용"],["N","미사용"]].map(([v,l])=>(
        <label key={v} style={{display:"flex",alignItems:"center",gap:5,fontSize:13,cursor:"pointer"}}>
          <input type="radio" checked={val===v} onChange={()=>onChange(v)} />{l}
        </label>
      ))}
    </div>
  );
  const BadgeUse = ({v}) => (
    <span style={{padding:"2px 8px",borderRadius:10,fontSize:11,fontWeight:600,
      background:v==="Y"?"#dcfce7":"#F9FAFC", color:v==="Y"?"#16a34a":"#929292"}}>
      {v==="Y"?"사용":"미사용"}
    </span>
  );
  const UseTab = ({val, onChange}) => (
    <div style={{display:"flex",gap:2}}>
      {["전체","사용","미사용"].map(v=>(
        <button key={v} onClick={()=>onChange(v)}
          style={{padding:"4px 10px",fontSize:11,border:`1px solid ${val===v?C.pri:C.brd}`,borderRadius:5,
            background:val===v?C.pri:"#fff",color:val===v?"#fff":C.txS,cursor:"pointer",fontWeight:val===v?600:400}}>
          {v}
        </button>
      ))}
    </div>
  );
  const ConfirmModal = ({title, msg, onOk, onCancel}) => (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:1100,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#fff",borderRadius:12,padding:28,width:340,boxShadow:"0 8px 32px rgba(0,0,0,.2)"}}>
        <div style={{fontSize:15,fontWeight:700,marginBottom:8,color:"#ef4444"}}>{title}</div>
        <div style={{fontSize:13,color:C.txS,marginBottom:20,lineHeight:1.6}}>{msg}</div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
          <Btn onClick={onCancel}>취소</Btn>
          <button onClick={onOk} style={{padding:"7px 16px",fontSize:13,background:"#ef4444",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontWeight:600}}>삭제</button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <PH title="시스템코드" bc="홈 > 보안 및 개발 > 시스템코드" />

      <div style={{display:"flex",gap:16,maxHeight:"calc(100vh - 170px)",boxSizing:"border-box"}}>

        {/* ── 좌: 코드 그룹 ── */}
        <div style={{width:240,flexShrink:0,display:"flex",flexDirection:"column",background:"#fff",border:`1px solid ${C.brd}`,borderRadius:10,overflow:"hidden"}}>

          <div style={{padding:"13px 16px",borderBottom:`1px solid ${C.brd}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
            <span style={{fontSize:13,fontWeight:700,color:C.txt}}>코드 그룹</span>
            <Btn primary small onClick={()=>openGrpPanel(null,true)}>+ 추가</Btn>
          </div>

          <div style={{padding:"10px 12px",borderBottom:`1px solid ${C.brd}`,flexShrink:0,display:"flex",flexDirection:"column",gap:8}}>
            <input value={grpQ} onChange={e=>setGrpQ(e.target.value)} placeholder="그룹명 / ID 검색"
              style={{...inp,fontSize:12,padding:"6px 10px",width:"100%",boxSizing:"border-box"}} />
            <UseTab val={grpUseFilter} onChange={setGrpUseFilter} />
          </div>

          <div style={{flex:1,overflowY:"auto"}}>
            {filteredGroups.length === 0 && (
              <div style={{padding:30,textAlign:"center",color:C.txL,fontSize:12}}>등록된 코드 그룹이 없습니다.</div>
            )}
            {filteredGroups.map(g => {
              const sel = selGrp?.id===g.id;
              return (
                <div key={g.id}
                  onClick={()=>{ setSelGrp(g); setCodeQ(""); setCodeUseFilter("전체"); setCodePanel(false); }}
                  style={{padding:"9px 14px",cursor:"pointer", borderRadius:6, margin:"1px 6px",
                    background:sel?C.priL:"transparent",
                    transition:"all .3s"}}
                  onMouseEnter={e => { if (!sel) e.currentTarget.style.background = C.secL; }}
                  onMouseLeave={e => { if (!sel) e.currentTarget.style.background = sel ? C.priL : "transparent"; }}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,flex:1,minWidth:0}}>
                      <span style={{fontSize:14,fontWeight:sel?600:500,color:sel?C.sec:C.txt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{g.nm}</span>
                      {g.useYn==="N" && <BadgeUse v="N" />}
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                      <span style={{fontSize:11,color:C.txL,background:"#F9FAFC",borderRadius:10,padding:"1px 7px"}}>{g.cnt}</span>
                      <button
                        onClick={e => { e.stopPropagation(); openGrpPanel(g, false); }}
                        style={{ width:24, height:24, border:`1px solid ${C.brd}`, borderRadius:4, background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.txL, flexShrink:0 }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.secL; e.currentTarget.style.color = C.pri; e.currentTarget.style.borderColor = C.pri; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = C.txL; e.currentTarget.style.borderColor = C.brd; }}
                        title="수정">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                          <circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div style={{fontSize:11,color:C.txL,marginTop:2,fontFamily:"monospace"}}>{g.id}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── 우: 코드 목록 ── */}
        <div style={{flex:1, minWidth:0}}>
          {!selGrp ? (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",color:C.txL,gap:8}}>
              <div style={{fontSize:32}}>☰</div>
              <div style={{fontSize:13}}>왼쪽에서 코드 그룹을 선택하세요.</div>
            </div>
          ) : (<>
            <SB ph="코드값 / 코드명 검색" />
            <Tbl secTitle={`${selGrp.nm} 코드 목록`} secCount={curCodes.length} secButtons={<SecBtnP onClick={()=>openCodePanel(null,true)}>+ 코드 추가</SecBtnP>} cols={[
              { t: "순서", k: "sort", w: 70 },
              { t: "코드값", k: "cd", mw: 120, align: "left", r: v => <span style={{fontFamily:"monospace",fontSize:13,fontWeight:600,color:C.txt}}>{v}</span> },
              { t: "코드명", k: "nm", mw: 150, align: "left", r: (v, row) => <span onClick={e => { e.stopPropagation(); openCodePanel(row, false); }} style={{fontWeight:600,color:C.pri,cursor:"pointer"}}>{v}</span> },
              { t: "설명", k: "desc", align: "left", r: v => v || "—" },
              { t: "사용여부", k: "useYn", r: v => <BadgeUse v={v} /> },
              { t: "등록일", k: "regDt" },
            ]} data={curCodes} />
          </>)}
        </div>
      </div>

      {/* ── 사이드 패널: 코드 그룹 ── */}
      <SidePanel open={grpPanel} onClose={()=>setGrpPanel(false)}
        title={grpIsNew?"코드 그룹 추가":"코드 그룹 수정"} width={460}>
        {!grpIsNew && <PanelDeleteBtn onClick={()=>setGrpDel(grpForm.id)} />}
        <SecTitle label="그룹 정보" primary />
        <FormRow label="그룹 ID" required>
          <input value={grpForm.id} onChange={e=>sgf("id",e.target.value.toUpperCase())}
            placeholder="예) SYS_CUSTOM_TYPE" maxLength={40}
            style={{...inp,...(!grpIsNew?ro:{})}} readOnly={!grpIsNew} />
          {err(grpErrors.id)}
        </FormRow>
        <FormRow label="그룹명" required>
          <input value={grpForm.nm} onChange={e=>sgf("nm",e.target.value)}
            placeholder="예) 커스텀 유형" style={inp} maxLength={50} />
          {err(grpErrors.nm)}
        </FormRow>
        <FormRow label="설명">
          <textarea value={grpForm.desc} onChange={e=>sgf("desc",e.target.value)}
            placeholder="코드 그룹에 대한 설명" rows={3}
            style={{...inp,resize:"none",fontFamily:"inherit"}} maxLength={200} />
        </FormRow>
        <FormRow label="사용 여부">
          <UseRadio val={grpForm.useYn} onChange={v=>sgf("useYn",v)} />
        </FormRow>
        <PanelFooter onCancel={()=>setGrpPanel(false)} onSave={saveGroup}
          saveLabel={grpIsNew?"등록":"저장"} />
      </SidePanel>

      {/* ── 사이드 패널: 코드 ── */}
      <SidePanel open={codePanel} onClose={()=>setCodePanel(false)}
        title={codeIsNew?"코드 추가":"코드 수정"} width={460}>
        {!codeIsNew && <PanelDeleteBtn onClick={()=>setCodeDel(codeForm.id)} />}
        <SecTitle label="코드 정보" primary />
        <div style={{display:"flex",gap:12}}>
          <div style={{flex:1}}>
            <FormRow label="코드값" required>
              <input value={codeForm.cd} onChange={e=>scf("cd",e.target.value.toUpperCase())}
                placeholder="예) SSH" maxLength={40}
                style={{...inp,...(!codeIsNew?ro:{})}} readOnly={!codeIsNew} />
              {err(codeErrors.cd)}
            </FormRow>
          </div>
          <div style={{width:80}}>
            <FormRow label="정렬 순서">
              <input type="number" min={1} value={codeForm.sort}
                onChange={e=>scf("sort",parseInt(e.target.value)||1)} style={inp} />
            </FormRow>
          </div>
        </div>
        <FormRow label="코드명" required>
          <input value={codeForm.nm} onChange={e=>scf("nm",e.target.value)}
            placeholder="예) SSH Agent" style={inp} maxLength={50} />
          {err(codeErrors.nm)}
        </FormRow>
        <FormRow label="설명">
          <textarea value={codeForm.desc} onChange={e=>scf("desc",e.target.value)}
            placeholder="코드에 대한 설명" rows={2}
            style={{...inp,resize:"none",fontFamily:"inherit"}} maxLength={200} />
        </FormRow>
        <FormRow label="사용 여부">
          <UseRadio val={codeForm.useYn} onChange={v=>scf("useYn",v)} />
        </FormRow>
        <PanelFooter onCancel={()=>setCodePanel(false)} onSave={saveCode}
          saveLabel={codeIsNew?"등록":"저장"} />
      </SidePanel>

      {grpDel && <ConfirmModal title="코드 그룹 삭제"
        msg={`"${groups.find(g=>g.id===grpDel)?.nm}" 그룹을 삭제합니다.\n하위 코드가 없는 경우에만 삭제 가능합니다.`}
        onOk={()=>deleteGroup(grpDel)} onCancel={()=>setGrpDel(null)} />}
      {codeDel && <ConfirmModal title="코드 삭제"
        msg="선택한 코드를 삭제합니다. 계속하시겠습니까?"
        onOk={()=>deleteCode(codeDel)} onCancel={()=>setCodeDel(null)} />}
    </div>
  );
};

/* ── AGENT 권한관리 ── */
const MgrAgentAuth = () => {

  /* 에이전트 타입 정의 */
  const AGENT_TYPES = [
    { cd:"SSH",   nm:"SSH Agent",   icon:"🔑", desc:"SSH 프로토콜 기반",       forMid:["서버","WAS"] },
    { cd:"SNMP",  nm:"SNMP Agent",  icon:"📡", desc:"SNMP 프로토콜 기반",      forMid:["네트워크","보안","스토리지"] },
    { cd:"WEB",   nm:"Web Agent",   icon:"🌐", desc:"HTTP/HTTPS 기반",         forMid:["WEB","WAS"] },
    { cd:"DB",    nm:"DB Agent",    icon:"🗄️",  desc:"데이터베이스 접속 기반",  forMid:["DBMS"] },
    { cd:"LOCAL", nm:"Local Agent", icon:"💻", desc:"로컬 설치형",              forMid:["서버","백업","스토리지"] },
  ];

  /* 에이전트 접속 권한 초기 데이터 (자원 ID → 에이전트 설정 목록) */
  const INIT_AUTH = (() => {
    const data = {};
    // 샘플: RES 앞 30개에 대해 에이전트 설정 생성
    const sample = RES.slice(0, 30);
    sample.forEach((r, idx) => {
      const forTypes = AGENT_TYPES.filter(a => a.forMid.includes(r.mid));
      if (!forTypes.length) return;
      data[r.id] = forTypes.map((a, ai) => ({
        id: `${r.id}_${a.cd}`,
        resId: r.id,
        agentType: a.cd,
        host: r.ip,
        port: a.cd==="SSH"?22 : a.cd==="SNMP"?161 : a.cd==="WEB"?8080 : a.cd==="DB"?3306 : 0,
        authId: a.cd==="SSH"||a.cd==="DB"||a.cd==="LOCAL" ? `svc_${r.nm.toLowerCase().replace(/-/g,"_")}` : "",
        authPw: a.cd==="SSH"||a.cd==="DB"||a.cd==="LOCAL" ? "●●●●●●●●" : "",
        snmpVer: a.cd==="SNMP" ? "v2c" : "",
        community: a.cd==="SNMP" ? "public" : "",
        timeout: 10,
        retryCount: 3,
        useYn: (idx + ai) % 7 === 0 ? "N" : "Y",
        testResult: (idx + ai) % 5 === 0 ? "실패" : (idx + ai) % 3 === 0 ? "미확인" : "성공",
        testDt: (idx + ai) % 3 === 0 ? "" : `2026-02-${String(22 + (idx % 3)).padStart(2,"0")} ${String(9 + ai).padStart(2,"0")}:${String(idx * 3 % 60).padStart(2,"0")}`,
        regDt: "2026-01-10",
      }));
    });
    return data;
  })();

  /* 정보시스템 목록 */
  const SYS_LIST = [
    { id:"전체",   nm:"전체" },
    ..._sIds.map(id => ({ id, nm: _sysMap[id] }))
  ];

  const MID_LIST = ["전체", ..._mids];

  const PAGE_SZ = 15;

  const [authMap, setAuthMap]   = useState(INIT_AUTH);
  const [selRes,  setSelRes]    = useState(null);
  const [selSys,  setSelSys]    = useState("전체");
  const [selMid,  setSelMid]    = useState("전체");
  const [resQ,    setResQ]      = useState("");
  const [resPage, setResPage]   = useState(1);

  /* 에이전트 설정 패널 */
  const [panel,      setPanel]      = useState(false);
  const [panelForm,  setPanelForm]  = useState(null);
  const [panelIsNew, setPanelIsNew] = useState(false);
  const [panelErr,   setPanelErr]   = useState({});
  const [showPw,     setShowPw]     = useState(false);
  const [testLoading,setTestLoading]= useState(false);

  /* 삭제 확인 */
  const [delTarget, setDelTarget] = useState(null);

  /* 자원 필터 */
  const filteredRes = RES.filter(r => {
    if (r.st === "미사용") return false;
    if (selSys !== "전체" && r.sysId !== selSys) return false;
    if (selMid !== "전체" && r.mid !== selMid) return false;
    if (resQ && !r.nm.toLowerCase().includes(resQ.toLowerCase()) && !r.ip.includes(resQ)) return false;
    return true;
  });
  const totalResPages = Math.max(1, Math.ceil(filteredRes.length / PAGE_SZ));
  const pagedRes = filteredRes.slice((resPage-1)*PAGE_SZ, resPage*PAGE_SZ);

  /* 현재 선택 자원의 에이전트 목록 */
  const curAuth = selRes ? (authMap[selRes.id] || []) : [];

  /* 에이전트 타입에 따라 적합 여부 판단 */
  const isRecommended = (agentCd) => {
    if (!selRes) return false;
    const ag = AGENT_TYPES.find(a=>a.cd===agentCd);
    return ag?.forMid.includes(selRes.mid) || false;
  };
  const availableAgents = AGENT_TYPES.filter(a => !curAuth.some(c=>c.agentType===a.cd));

  const openPanel = (auth, isNew=false, agentType=null) => {
    if (isNew) {
      const ag = AGENT_TYPES.find(a=>a.cd===agentType) || AGENT_TYPES[0];
      setPanelForm({
        id: `${selRes.id}_${ag.cd}_${Date.now()}`,
        resId: selRes.id,
        agentType: ag.cd,
        host: selRes.ip,
        port: ag.cd==="SSH"?22 : ag.cd==="SNMP"?161 : ag.cd==="WEB"?8080 : ag.cd==="DB"?3306 : 0,
        authId:"", authPw:"", snmpVer:"v2c", community:"public",
        timeout:10, retryCount:3, useYn:"Y", testResult:"미확인", testDt:"", regDt:"2026-02-24",
      });
    } else {
      setPanelForm({...auth});
    }
    setPanelIsNew(isNew);
    setPanelErr({});
    setShowPw(false);
    setPanel(true);
  };

  const saveAuth = () => {
    const e = {};
    if (!panelForm.host.trim()) e.host = "호스트(IP)를 입력하세요.";
    if (["SSH","DB","LOCAL"].includes(panelForm.agentType) && !panelForm.authId.trim()) e.authId = "접속 ID를 입력하세요.";
    setPanelErr(e);
    if (Object.keys(e).length) return;
    const list = authMap[selRes.id] || [];
    if (panelIsNew) {
      setAuthMap(p=>({...p, [selRes.id]:[...list, panelForm]}));
    } else {
      setAuthMap(p=>({...p, [selRes.id]:list.map(a=>a.id===panelForm.id?{...a,...panelForm}:a)}));
    }
    setPanel(false);
  };

  const deleteAuth = (id) => {
    setAuthMap(p=>({...p, [selRes.id]:(p[selRes.id]||[]).filter(a=>a.id!==id)}));
    setDelTarget(null); setPanel(false);
  };

  const handleTest = () => {
    setTestLoading(true);
    setTimeout(()=>{
      const ok = Math.random() > 0.3;
      setPanelForm(p=>({...p, testResult:ok?"성공":"실패", testDt:"2026-02-24 " + new Date().toTimeString().slice(0,8)}));
      setTestLoading(false);
    }, 1200);
  };

  const spf = (k,v) => setPanelForm(p=>({...p,[k]:v}));
  const inp = {...fInput};
  const ro  = {background:"#f0f1f3",color:C.txS,pointerEvents:"none"};
  const err = (msg) => msg ? <div style={{fontSize:11,color:"#ef4444",marginTop:3}}>{msg}</div> : null;

  const BadgeUse = ({v}) => (
    <span style={{padding:"2px 8px", borderRadius:10, fontSize:11, fontWeight:600,
      background:v==="Y"?"#dcfce7":"#F9FAFC", color:v==="Y"?"#16a34a":"#929292"}}>
      {v==="Y"?"사용":"미사용"}
    </span>
  );

  const AgentBadge = ({cd}) => {
    const ag = AGENT_TYPES.find(a=>a.cd===cd);
    const colors = { SSH:[C.priL,"#2563eb"], SNMP:["#f0fdf4","#16a34a"], WEB:["#fefce8","#ca8a04"], DB:["#fdf4ff","#9333ea"], LOCAL:["#fff7ed","#ea580c"] };
    const [bg,tx] = colors[cd]||["#F9FAFC","#929292"];
    return (
      <span style={{padding:"2px 9px",borderRadius:10,fontSize:11,fontWeight:700,background:bg,color:tx}}>
        {ag?.icon} {ag?.nm||cd}
      </span>
    );
  };

  const TestBadge = ({v}) => {
    if (!v || v==="미확인") return <span style={{fontSize:11,color:C.txL}}>미확인</span>;
    return (
      <span style={{padding:"2px 9px",borderRadius:10,fontSize:11,fontWeight:700,
        background:v==="성공"?"#dcfce7":"#fee2e2",color:v==="성공"?"#16a34a":"#dc2626"}}>{v}</span>
    );
  };

  const UseRadio = ({val,onChange}) => (
    <div style={{display:"flex",gap:16}}>
      {[["Y","사용"],["N","미사용"]].map(([v,l])=>(
        <label key={v} style={{display:"flex",alignItems:"center",gap:5,fontSize:13,cursor:"pointer"}}>
          <input type="radio" checked={val===v} onChange={()=>onChange(v)} />{l}
        </label>
      ))}
    </div>
  );

  const ConfirmModal = ({title,msg,onOk,onCancel}) => (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:1100,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"#fff",borderRadius:12,padding:28,width:340,boxShadow:"0 8px 32px rgba(0,0,0,.2)"}}>
        <div style={{fontSize:15,fontWeight:700,marginBottom:8,color:"#ef4444"}}>{title}</div>
        <div style={{fontSize:13,color:C.txS,marginBottom:20,lineHeight:1.6}}>{msg}</div>
        <div style={{display:"flex",justifyContent:"flex-end",gap:8}}>
          <Btn onClick={onCancel}>취소</Btn>
          <button onClick={onOk} style={{padding:"7px 16px",fontSize:13,background:"#ef4444",color:"#fff",border:"none",borderRadius:6,cursor:"pointer",fontWeight:600}}>삭제</button>
        </div>
      </div>
    </div>
  );

  /* 에이전트 타입에 따른 접속정보 필드 렌더 */
  const renderAuthFields = () => {
    if (!panelForm) return null;
    const t = panelForm.agentType;
    return (
      <>
        {/* 공통: 호스트 + 포트 */}
        <div style={{display:"flex",gap:12}}>
          <div style={{flex:1}}>
            <FormRow label="호스트 (IP)" required>
              <input value={panelForm.host} onChange={e=>spf("host",e.target.value)}
                placeholder="예) 10.100.1.1" style={inp} />
              {err(panelErr.host)}
            </FormRow>
          </div>
          <div style={{width:90}}>
            <FormRow label="포트">
              <input type="number" value={panelForm.port} onChange={e=>spf("port",parseInt(e.target.value)||0)}
                style={inp} />
            </FormRow>
          </div>
        </div>

        {/* SSH / DB / LOCAL: ID + PW */}
        {["SSH","DB","LOCAL"].includes(t) && (
          <>
            <FormRow label="접속 ID" required>
              <input value={panelForm.authId} onChange={e=>spf("authId",e.target.value)}
                placeholder="접속 계정 ID" style={inp} />
              {err(panelErr.authId)}
            </FormRow>
            <FormRow label="접속 PW">
              <div style={{position:"relative"}}>
                <input type={showPw?"text":"password"} value={panelForm.authPw}
                  onChange={e=>spf("authPw",e.target.value)}
                  placeholder="접속 비밀번호"
                  style={{...inp,paddingRight:40}} />
                <button onClick={()=>setShowPw(p=>!p)}
                  style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%)",
                    background:"none",border:"none",cursor:"pointer",fontSize:14,color:C.txL}}>
                  {showPw?"🙈":"👁️"}
                </button>
              </div>
            </FormRow>
          </>
        )}

        {/* SNMP: 버전 + 커뮤니티 */}
        {t==="SNMP" && (
          <>
            <FormRow label="SNMP 버전">
              <select value={panelForm.snmpVer} onChange={e=>spf("snmpVer",e.target.value)} style={inp}>
                {["v1","v2c","v3"].map(v=><option key={v}>{v}</option>)}
              </select>
            </FormRow>
            <FormRow label="Community">
              <input value={panelForm.community} onChange={e=>spf("community",e.target.value)}
                placeholder="예) public" style={inp} />
            </FormRow>
          </>
        )}

        {/* 공통: 타임아웃 + 재시도 */}
        <div style={{display:"flex",gap:12}}>
          <div style={{flex:1}}>
            <FormRow label="타임아웃 (초)">
              <input type="number" min={1} max={120} value={panelForm.timeout}
                onChange={e=>spf("timeout",parseInt(e.target.value)||10)} style={inp} />
            </FormRow>
          </div>
          <div style={{flex:1}}>
            <FormRow label="재시도 횟수">
              <input type="number" min={0} max={10} value={panelForm.retryCount}
                onChange={e=>spf("retryCount",parseInt(e.target.value)||0)} style={inp} />
            </FormRow>
          </div>
        </div>

        <FormRow label="사용 여부">
          <UseRadio val={panelForm.useYn} onChange={v=>spf("useYn",v)} />
        </FormRow>
      </>
    );
  };

  return (
    <div>
      <PH title="AGENT 권한관리" bc="홈 > 보안 및 개발 > AGENT 권한관리" />

      <div style={{display:"flex",gap:16,maxHeight:"calc(100vh - 170px)",boxSizing:"border-box"}}>

        {/* ── 좌: 자원 목록 ── */}
        <div style={{width:240,flexShrink:0,display:"flex",flexDirection:"column",background:"#fff",border:`1px solid ${C.brd}`,borderRadius:10,overflow:"hidden"}}>

          {/* 헤더 */}
          <div style={{padding:"13px 16px",borderBottom:`1px solid ${C.brd}`,flexShrink:0}}>
            <div style={{fontSize:13,fontWeight:700,color:C.txt,marginBottom:10}}>자원 선택</div>
            {/* 정보시스템 필터 */}
            <select value={selSys} onChange={e=>{setSelSys(e.target.value);setResPage(1);setSelRes(null);}}
              style={{...inp,fontSize:12,padding:"6px 10px",width:"100%",boxSizing:"border-box",marginBottom:8}}>
              {SYS_LIST.map(s=><option key={s.id} value={s.id}>{s.nm}</option>)}
            </select>
            {/* 분류 필터 */}
            <div style={{display:"flex",gap:4,flexWrap:"wrap",marginBottom:8}}>
              {MID_LIST.map(m=>(
                <button key={m} onClick={()=>{setSelMid(m);setResPage(1);setSelRes(null);}}
                  style={{padding:"3px 8px",fontSize:11,border:`1px solid ${selMid===m?C.pri:C.brd}`,borderRadius:5,
                    background:selMid===m?C.pri:"#fff",color:selMid===m?"#fff":C.txS,cursor:"pointer",fontWeight:selMid===m?600:400}}>
                  {m}
                </button>
              ))}
            </div>
            {/* 검색 */}
            <input value={resQ} onChange={e=>{setResQ(e.target.value);setResPage(1);}}
              placeholder="자원명 / IP 검색"
              style={{...inp,fontSize:12,padding:"6px 10px",width:"100%",boxSizing:"border-box"}} />
          </div>

          {/* 자원 리스트 */}
          <div style={{flex:1,overflowY:"auto"}}>
            {pagedRes.length===0 && (
              <div style={{padding:30,textAlign:"center",color:C.txL,fontSize:12}}>자원이 없습니다.</div>
            )}
            {pagedRes.map(r => {
              const sel = selRes?.id===r.id;
              const authList = authMap[r.id]||[];
              const hasAny = authList.length > 0;
              const allOk  = hasAny && authList.every(a=>a.testResult==="성공"&&a.useYn==="Y");
              const hasFail= authList.some(a=>a.testResult==="실패");
              const dotColor = !hasAny?"#EEEEEE":hasFail?"#ef4444":allOk?"#16a34a":"#f59e0b";
              return (
                <div key={r.id}
                  onClick={()=>{ setSelRes(r); setPanel(false); }}
                  style={{padding:"9px 14px",cursor:"pointer", borderRadius:6, margin:"1px 6px",
                    background:sel?C.priL:"transparent",
                    transition:"all .3s"}}
                  onMouseEnter={e => { if (!sel) e.currentTarget.style.background = C.secL; }}
                  onMouseLeave={e => { if (!sel) e.currentTarget.style.background = sel ? C.priL : "transparent"; }}>
                  <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                    <div style={{display:"flex",alignItems:"center",gap:7,flex:1,minWidth:0}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:dotColor,flexShrink:0}} />
                      <span style={{fontSize:14,fontWeight:sel?600:500,color:sel?C.sec:C.txt,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.nm}</span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:4,flexShrink:0}}>
                      <span style={{fontSize:11,color:C.txL,background:"#F9FAFC",borderRadius:10,padding:"1px 7px"}}>{authList.length}</span>
                      <button
                        onClick={e => { e.stopPropagation(); setSelRes(r); }}
                        style={{ width:24, height:24, border:`1px solid ${C.brd}`, borderRadius:4, background:"#fff", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:C.txL, flexShrink:0 }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.secL; e.currentTarget.style.color = C.pri; e.currentTarget.style.borderColor = C.pri; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "#fff"; e.currentTarget.style.color = C.txL; e.currentTarget.style.borderColor = C.brd; }}
                        title="상세 보기">
                        <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                          <circle cx="8" cy="3" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="8" cy="13" r="1.5"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div style={{fontSize:11,color:C.txL,marginTop:2,display:"flex",gap:8,paddingLeft:15}}>
                    <span>{r.mid}</span>
                    <span>·</span>
                    <span>{r.sysNm}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 페이지네이션 */}
          {totalResPages > 1 && (
            <div style={{padding:"8px 12px",borderTop:`1px solid ${C.brd}`,display:"flex",alignItems:"center",justifyContent:"center",gap:3,flexShrink:0}}>
              <button onClick={()=>setResPage(p=>Math.max(1,p-1))} disabled={resPage===1}
                style={{padding:"4px 8px",fontSize:11,border:`1px solid ${C.brd}`,borderRadius:4,background:"#fff",color:resPage===1?C.txL:C.txt,cursor:resPage===1?"default":"pointer"}}>‹</button>
              <span style={{fontSize:12,color:C.txS,padding:"0 8px"}}>{resPage} / {totalResPages}</span>
              <button onClick={()=>setResPage(p=>Math.min(totalResPages,p+1))} disabled={resPage===totalResPages}
                style={{padding:"4px 8px",fontSize:11,border:`1px solid ${C.brd}`,borderRadius:4,background:"#fff",color:resPage===totalResPages?C.txL:C.txt,cursor:resPage===totalResPages?"default":"pointer"}}>›</button>
            </div>
          )}
        </div>

        {/* ── 우: 에이전트 권한 목록 ── */}
        <div style={{flex:1, minWidth:0}}>
          {!selRes ? (
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",height:"100%",color:C.txL,gap:8}}>
              <div style={{fontSize:36}}>🔐</div>
              <div style={{fontSize:14,fontWeight:600,color:C.txS}}>자원을 선택하세요</div>
              <div style={{fontSize:12}}>왼쪽에서 자원을 선택하면 에이전트 접속 권한을 관리할 수 있습니다.</div>
            </div>
          ) : (<>
            <SB ph="에이전트, 호스트 검색" />
            <Tbl secTitle={`${selRes.nm} 에이전트 목록`} secCount={curAuth.length} secButtons={availableAgents.length > 0 && (
              <div style={{position:"relative"}}>
                <select defaultValue=""
                  onChange={e=>{ if(e.target.value){ openPanel(null,true,e.target.value); e.target.value=""; }}}
                  style={{fontSize:13,padding:"6px 12px",color:C.pri,border:`1px solid ${C.pri}`,borderRadius:4,fontWeight:600,background:"#fff",cursor:"pointer",fontFamily:"inherit"}}>
                  <option value="" disabled>+ 에이전트 추가</option>
                  {availableAgents.map(a=>(
                    <option key={a.cd} value={a.cd}>{a.icon} {a.nm}</option>
                  ))}
                </select>
              </div>
            )} cols={[
              { t: "에이전트", k: "agentType", r: v => <AgentBadge cd={v} /> },
              { t: "호스트", k: "host", r: v => <span style={{fontFamily:"monospace",fontSize:13}}>{v}</span> },
              { t: "포트", k: "port", r: v => <span style={{fontFamily:"monospace",fontSize:13}}>{v||"—"}</span> },
              { t: "접속 정보", k: "id", r: (_, row) => {
                const info = row.agentType==="SNMP" ? `${row.snmpVer} / ${row.community}` : row.authId ? row.authId : "—";
                return <span style={{fontSize:13}}>{info}</span>;
              }},
              { t: "타임아웃", k: "timeout", r: v => `${v}초` },
              { t: "연결 테스트", k: "testResult", r: (v, row) => <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
                <TestBadge v={v} />
                {row.testDt && <span style={{fontSize:10,color:C.txL,fontFamily:"monospace"}}>{row.testDt}</span>}
              </div> },
              { t: "사용여부", k: "useYn", r: v => <BadgeUse v={v} /> },
              { t: "등록일", k: "regDt" },
            ]} data={curAuth} onRow={r => openPanel(r, false)} />
          </>)}
        </div>
      </div>

      {/* ── 사이드 패널: 에이전트 설정 ── */}
      <SidePanel open={panel} onClose={()=>setPanel(false)}
        title={panelIsNew?"에이전트 접속 설정 추가":"에이전트 접속 설정 수정"} width={460}>
        {panelForm && (
          <>
            {!panelIsNew && <PanelDeleteBtn onClick={()=>setDelTarget(panelForm.id)} />}

            <SecTitle label="에이전트 정보" primary />
            <div style={{marginBottom:16,padding:"12px 14px",background:"#f8fafc",border:`1px solid ${C.brd}`,borderRadius:8,display:"flex",alignItems:"center",gap:12}}>
              <AgentBadge cd={panelForm.agentType} />
              <div style={{fontSize:12,color:C.txS}}>
                {AGENT_TYPES.find(a=>a.cd===panelForm.agentType)?.desc}
                {isRecommended(panelForm.agentType) &&
                  <span style={{marginLeft:8,fontSize:11,color:"#16a34a",fontWeight:600}}>✓ 권장 에이전트</span>}
              </div>
            </div>

            <SecTitle label="접속 정보" primary />
            {renderAuthFields()}

            {/* 연결 테스트 */}
            <div style={{marginTop:4,marginBottom:16,padding:"12px 14px",background:"#f8fafc",border:`1px solid ${C.brd}`,borderRadius:8}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:panelForm.testDt?8:0}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:12,fontWeight:600,color:C.txt}}>연결 테스트</span>
                  <TestBadge v={panelForm.testResult} />
                </div>
                <button onClick={handleTest} disabled={testLoading}
                  style={{padding:"5px 14px",fontSize:12,border:`1px solid ${C.pri}`,borderRadius:6,
                    background:testLoading?"#F9FAFC":C.priL,color:testLoading?C.txL:C.pri,
                    cursor:testLoading?"default":"pointer",fontWeight:600}}>
                  {testLoading?"테스트 중...":"연결 테스트"}
                </button>
              </div>
              {panelForm.testDt && (
                <div style={{fontSize:11,color:C.txL,marginTop:6,fontFamily:"monospace"}}>마지막 테스트: {panelForm.testDt}</div>
              )}
            </div>

            <PanelFooter onCancel={()=>setPanel(false)} onSave={saveAuth}
              saveLabel={panelIsNew?"등록":"저장"} />
          </>
        )}
      </SidePanel>

      {delTarget && (
        <ConfirmModal title="에이전트 설정 삭제"
          msg="선택한 에이전트 접속 설정을 삭제합니다. 계속하시겠습니까?"
          onOk={()=>deleteAuth(delTarget)} onCancel={()=>setDelTarget(null)} />
      )}
    </div>
  );
};

/* ── 라이선스 관리 ── */
/* ── 시스템 프로필 ── */
const MgrSysProfile = () => {
  const [form, setForm] = useState({
    orgName: "한국정보보호산업협회", phone: "02-1234-5678",
    siteName: "COMPLYSIGHT", siteShort: "CS",
    url: "https://complysight.example.com", accessIp: "192.168.1.0/24, 10.0.0.0/8",
    workStart: "09:00", workEnd: "18:00",
    timezone: "Asia/Seoul", language: "ko",
    mfaEnabled: "N",
    logoAlt: "COMPLYSIGHT 로고",
  });
  const [saveOk, setSaveOk] = useState(false);
  const sf = (k, v) => { setForm(p => ({ ...p, [k]: v })); setSaveOk(false); };
  const handleSave = () => { setSaveOk(true); setTimeout(() => setSaveOk(false), 2500); };

  const inpSt = { ...fInput };
  const BRow = ({ label, children, desc, required }) => (
    <div style={{ marginBottom:16 }}>
      <label style={{ fontSize:12, fontWeight:600, color:C.txS, marginBottom:6, display:"flex", alignItems:"center", gap:3 }}>
        {label}{required && <span style={{ color:"#ef4444", fontSize:11 }}>*</span>}
      </label>
      {children}
      {desc && <div style={{ fontSize:11, color:C.txL, marginTop:4 }}>{desc}</div>}
    </div>
  );

  return <div>
    <PH title="시스템 프로필" bc="홈 > 환경설정 > 시스템 프로필" />
    <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 20, alignItems: "start" }}>

      {/* 왼쪽: 입력 폼 */}
      <div style={{ background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 12, padding: "28px 32px" }}>
        <SecTitle label="기관 정보" primary />
        <BRow label="기관명" required>
          <input value={form.orgName} onChange={e => sf("orgName", e.target.value)} placeholder="기관명을 입력하세요" style={inpSt} />
        </BRow>
        <BRow label="전화번호">
          <input value={form.phone} onChange={e => sf("phone", e.target.value)} placeholder="02-0000-0000" style={inpSt} />
        </BRow>

        <div style={{ borderTop: `1px solid ${C.brd}`, margin: "20px 0" }} />
        <SecTitle label="사이트 정보" />
        <BRow label="사이트 명" required>
          <input value={form.siteName} onChange={e => sf("siteName", e.target.value)} placeholder="사이트 명칭" style={inpSt} />
        </BRow>
        <BRow label="사이트 약칭명" desc="사이드바, 헤더 등에 노출되는 짧은 명칭입니다.">
          <input value={form.siteShort} onChange={e => sf("siteShort", e.target.value)} placeholder="약칭 (최대 10자)" style={inpSt} maxLength={10} />
        </BRow>
        <BRow label="URL" desc="외부에서 접속 가능한 서비스 URL을 입력하세요.">
          <input value={form.url} onChange={e => sf("url", e.target.value)} placeholder="https://" style={inpSt} />
        </BRow>
        <BRow label="접근 IP" desc="접근을 허용할 IP 대역을 입력합니다. 비워두면 모든 IP에서 접근 가능합니다.">
          <input value={form.accessIp} onChange={e => sf("accessIp", e.target.value)} placeholder="허용 IP 대역 (쉼표 구분)" style={inpSt} />
        </BRow>

        <div style={{ borderTop: `1px solid ${C.brd}`, margin: "20px 0" }} />
        <SecTitle label="운영 설정" />
        <BRow label="표준 시간대" desc="시스템의 기준 시간대를 설정합니다.">
          <select value={form.timezone} onChange={e => sf("timezone", e.target.value)} style={{ ...inpSt, cursor:"pointer", maxWidth:320 }}>
            <option value="Asia/Seoul">Asia/Seoul (KST, UTC+9)</option>
            <option value="Asia/Tokyo">Asia/Tokyo (JST, UTC+9)</option>
            <option value="UTC">UTC</option>
          </select>
        </BRow>
        <BRow label="언어" desc="시스템 기본 표시 언어를 설정합니다.">
          <select value={form.language} onChange={e => sf("language", e.target.value)} style={{ ...inpSt, cursor:"pointer", maxWidth:320 }}>
            <option value="ko">한국어 (대한민국)</option>
            <option value="en">English (US)</option>
            <option value="ja">日本語</option>
          </select>
        </BRow>
        <BRow label="업무시간 설정" desc="점검 스케줄 및 알림에 적용되는 업무시간입니다.">
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <input type="time" value={form.workStart} onChange={e => sf("workStart", e.target.value)} style={{ ...inpSt, width:"auto" }} />
            <span style={{ color:C.txL, fontSize:13 }}>~</span>
            <input type="time" value={form.workEnd} onChange={e => sf("workEnd", e.target.value)} style={{ ...inpSt, width:"auto" }} />
          </div>
        </BRow>
        <BRow label="추가인증 사용여부" desc="로그인 시 OTP 등 추가인증을 적용합니다.">
          <div style={{ display:"flex", gap:16 }}>
            {[["Y","사용"],["N","미사용"]].map(([v,l]) => (
              <label key={v} style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, cursor:"pointer" }}>
                <input type="radio" checked={form.mfaEnabled === v} onChange={() => sf("mfaEnabled", v)} style={{ accentColor:C.pri }} /> {l}
              </label>
            ))}
          </div>
        </BRow>

        <div style={{ borderTop: `1px solid ${C.brd}`, margin: "20px 0" }} />
        <SecTitle label="로고 설정" />
        <BRow label="로고 이미지">
          <div style={{ display:"flex", alignItems:"center", gap:16 }}>
            <div style={{ width:120, height:48, border:`2px dashed ${C.brd}`, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", background:"#F9FAFC", flexShrink:0 }}>
              <span style={{ fontSize:11, color:C.txL }}>미리보기</span>
            </div>
            <div>
              <label style={{ display:"inline-flex", alignItems:"center", gap:5, padding:"6px 14px", border:`1px solid ${C.brd}`, borderRadius:5, fontSize:12, color:C.txS, cursor:"pointer", background:"#fff" }}>
                📎 파일 선택
                <input type="file" accept="image/*" style={{ display:"none" }} />
              </label>
              <div style={{ fontSize:11, color:C.txL, marginTop:4 }}>PNG, JPG, SVG (최대 2MB)</div>
            </div>
          </div>
        </BRow>
        <BRow label="로고 이미지 대체텍스트" desc="이미지 로딩 실패 시 표시되는 텍스트입니다.">
          <input value={form.logoAlt} onChange={e => sf("logoAlt", e.target.value)} placeholder="로고 alt 텍스트" style={inpSt} />
        </BRow>

        {saveOk && (
          <div style={{ padding:"10px 14px", borderRadius:8, background:"#f0fdf4", border:"1px solid #bbf7d0", fontSize:13, color:"#16a34a", marginBottom:12 }}>
            ✓ 설정이 저장되었습니다.
          </div>
        )}

        <div style={{ display:"flex", justifyContent:"flex-end", paddingTop:12, borderTop:`1px solid ${C.brd}` }}>
          <Btn primary onClick={handleSave}>저장</Btn>
        </div>
      </div>

      {/* 오른쪽: 현재 설정 요약 */}
      <div style={{ background: "#fff", border: `1px solid ${C.brd}`, borderRadius: 12, padding: "22px 22px" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: C.txt, marginBottom: 16 }}>현재 설정 요약</div>
        {[
          ["기관명", form.orgName],
          ["전화번호", form.phone],
          ["사이트 명", form.siteName],
          ["약칭", form.siteShort],
          ["URL", form.url],
          ["접근 IP", form.accessIp],
          ["시간대", form.timezone],
          ["언어", form.language === "ko" ? "한국어" : form.language === "en" ? "English" : "日本語"],
          ["업무시간", `${form.workStart} ~ ${form.workEnd}`],
          ["추가인증", form.mfaEnabled === "Y" ? "사용" : "미사용"],
          ["로고 alt", form.logoAlt],
        ].map(([k, v]) => (
          <div key={k} style={{ display:"flex", gap:8, marginBottom:8, fontSize:12 }}>
            <span style={{ color:C.txS, minWidth:70, flexShrink:0 }}>{k}</span>
            <span style={{ color:C.txt, wordBreak:"break-all" }}>{v || "—"}</span>
          </div>
        ))}
      </div>

    </div>
  </div>;
};

/* ── 시스템정보 ── */
const SYS_INFO = [
  { k: "java.vendor", v: "Oracle Corporation" },
  { k: "com.sun.xml.rpc.streaming.XMLReaderFactory", v: "jeus.webservices.jaxrpc.streaming.XMLReaderFactoryImpl" },
  { k: "sun.java.launcher", v: "SUN_STANDARD" },
  { k: "sun.management.compiler", v: "HotSpot 64-Bit Tiered Compilers" },
  { k: "os.name", v: "Windows Server 2019" },
  { k: "sun.boot.class.path", v: "C:\\TmaxSoft\\JEUS8\\lib\\system\\extension.jar;C:\\TmaxSoft\\JEUS8\\lib\\endorsed\\activation-1.1.1.jar;..." },
  { k: "java.util.logging.config.file", v: "C:\\TmaxSoft\\JEUS8\\bin\\logging.properties" },
  { k: "sun.desktop", v: "windows" },
  { k: "java.vm.specification.vendor", v: "Oracle Corporation" },
  { k: "java.runtime.version", v: "1.8.0_291-b10" },
  { k: "com.sun.xml.ws.tx.txnMgrJndiName", v: "java:wsit/TransactionManager" },
  { k: "user.name", v: "AYF-WAS$" },
  { k: "org.apache.jasper.Constants.TAG_FILE_PACKAGE_NAME", v: "jeus_tagwork" },
  { k: "user.language", v: "ko" },
  { k: "java.vm.name", v: "Java HotSpot(TM) 64-Bit Server VM" },
  { k: "java.version", v: "1.8.0_291" },
  { k: "sun.os.patch.level", v: "" },
  { k: "java.vm.vendor", v: "Oracle Corporation" },
  { k: "file.encoding", v: "MS949" },
  { k: "java.specification.version", v: "1.8" },
  { k: "os.arch", v: "amd64" },
  { k: "os.version", v: "10.0" },
  { k: "user.dir", v: "C:\\TmaxSoft\\JEUS8" },
  { k: "java.home", v: "C:\\TmaxSoft\\JDK\\jdk1.8\\jre" },
  { k: "java.class.version", v: "52.0" },
];
const MgrSysInfo = () => {
  const [q, setQ] = useState("");
  const filtered = SYS_INFO.filter(r => !q || r.k.toLowerCase().includes(q.toLowerCase()) || r.v.toLowerCase().includes(q.toLowerCase()));
  return <div>
    <PH title="시스템정보" bc="홈 > 환경설정 > 시스템정보" />
    <Tbl secTitle="시스템 속성 정보" secCount={filtered.length} cols={[
      { t: "KEY", k: "k", align: "left" },
      { t: "VALUE", k: "v", align: "left" },
    ]} data={filtered} pageSize={25} noPaging />
  </div>;
};

const MgrLicense = () => {

  /* ── 라이선스 코드 → 플랜 매핑 (실제 서버에서 검증) ── */
  const CODE_MAP = {
    "CS-BASIC-2026-AABB": { planId: "PLAN_BASIC", planNm: "Basic",    type: "Basic",    startDt: "2026-03-01", endDt: "2026-12-31", cycle: "연간", autoRenew: false },
    "CS-STD-2026-CCDD":   { planId: "PLAN_STD",   planNm: "Standard", type: "Standard", startDt: "2026-03-01", endDt: "2027-02-28", cycle: "연간", autoRenew: true  },
    "CS-PREM-2026-EEFF":  { planId: "PLAN_PREM",  planNm: "Premium",  type: "Premium",  startDt: "2026-03-01", endDt: "2027-02-28", cycle: "연간", autoRenew: true  },
  };

  const PLAN_FEATURES = {
    "PLAN_BASIC": ["정보시스템 최대 3개", "자원 최대 30개", "일상점검", "공지사항", "기본 대시보드"],
    "PLAN_STD":   ["정보시스템 최대 10개", "자원 최대 100개", "일상점검 + 특별점검", "자동점검 연동", "알림 설정", "점검 이력"],
    "PLAN_PREM":  ["정보시스템 무제한", "자원 무제한", "전체 기능 포함", "API 연동", "전담 기술지원", "SLA 보장"],
  };

  const TODAY = "2026-02-24";

  /* ── 초기 라이선스 목록 ── */
  const INIT_LICENSES = [
    { id: "LIC001", code: "CS-STD-2025-XXXX", planId: "PLAN_STD",   planNm: "Standard", type: "Standard", startDt: "2025-03-01", endDt: "2026-02-28", cycle: "연간", autoRenew: true,  status: "만료 예정", regDt: "2025-03-01" },
    { id: "LIC002", code: "CS-BASIC-2024-YYYY",planId: "PLAN_BASIC", planNm: "Basic",    type: "Basic",    startDt: "2024-03-01", endDt: "2025-02-28", cycle: "연간", autoRenew: false, status: "만료",    regDt: "2024-03-01" },
  ];

  const [licenses,    setLicenses]   = useState(INIT_LICENSES);
  const [panel,       setPanel]      = useState(null);   // null | "add" | "detail"
  const [selLic,      setSelLic]     = useState(null);   // 선택된 라이선스
  const [codeInput,   setCodeInput]  = useState("");     // 라이선스 코드 입력
  const [codeError,   setCodeError]  = useState("");
  const [codePreview, setCodePreview]= useState(null);   // 코드 검증 결과 미리보기
  const [confirmMsg,  setConfirmMsg] = useState(null);
  const [toast,       setToast]      = useState("");

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(""), 2800); };

  /* ── 만료 30일 이내 ── */
  const isExpiringSoon = (endDt) => {
    const diff = (new Date(endDt) - new Date(TODAY)) / 86400000;
    return diff >= 0 && diff <= 30;
  };

  /* ── 상태 계산 ── */
  const calcStatus = (lic) => {
    if (lic.status === "해지") return "해지";
    if (new Date(lic.endDt) < new Date(TODAY)) return "만료";
    if (isExpiringSoon(lic.endDt)) return "만료 예정";
    return "구독중";
  };

  /* ── 플랜 타입 색 ── */
  const PLAN_COLOR = {
    Basic:    { pri: "#6366f1", light: "#eef2ff" },
    Standard: { pri: C.pri,    light: C.priL      },
    Premium:  { pri: "#0f766e", light: "#f0fdfa"  },
  };

  /* ── 상태 배지 ── */
  const StatusBadge = ({ status }) => {
    const MAP = {
      "구독중":   { bg: "#dcfce7", c: "#16a34a" },
      "만료 예정":{ bg: "#fafafa", c: "#929292"  },
      "만료":     { bg: "#fee2e2", c: "#dc2626"  },
      "해지":     { bg: "#f1f5f9", c: "#94a3b8"  },
    };
    const s = MAP[status] || { bg: "#F9FAFC", c: "#929292" };
    return <span style={{ padding: "2px 9px", borderRadius: 10, fontSize: 11, fontWeight: 700, background: s.bg, color: s.c }}>{status}</span>;
  };

  /* ── 라이선스 코드 검증 ── */
  const handleCodeCheck = () => {
    const code = codeInput.trim().toUpperCase();
    if (!code) { setCodeError("라이선스 코드를 입력하세요."); setCodePreview(null); return; }
    /* 이미 등록된 코드인지 확인 */
    if (licenses.some(l => l.code.toUpperCase() === code)) {
      setCodeError("이미 등록된 라이선스 코드입니다."); setCodePreview(null); return;
    }
    const found = CODE_MAP[code];
    if (!found) { setCodeError("유효하지 않은 라이선스 코드입니다."); setCodePreview(null); return; }
    setCodeError("");
    setCodePreview({ ...found, code });
  };

  /* ── 라이선스 추가 확정 ── */
  const handleAddLicense = () => {
    if (!codePreview) return;
    const newLic = {
      id: "LIC" + String(licenses.length + 1).padStart(3, "0"),
      ...codePreview,
      status: "구독중",
      regDt: TODAY,
    };
    setLicenses(p => [newLic, ...p]);
    setPanel(null);
    setCodeInput(""); setCodePreview(null); setCodeError("");
    showToast("라이선스가 등록되었습니다.");
  };

  /* ── 자동갱신 변경 ── */
  const handleToggleAutoRenew = (id, val) => {
    setLicenses(p => p.map(l => l.id === id ? { ...l, autoRenew: val } : l));
    showToast("자동 갱신 설정이 변경되었습니다.");
  };

  /* ── 해지 ── */
  const handleCancel = (id) => {
    setConfirmMsg({
      title: "라이선스 해지",
      msg: "라이선스를 해지하면 만료일까지 사용 가능하며 이후 서비스가 중단됩니다. 해지하시겠습니까?",
      onOk: () => {
        setLicenses(p => p.map(l => l.id === id ? { ...l, status: "해지", autoRenew: false } : l));
        setSelLic(prev => prev?.id === id ? { ...prev, status: "해지", autoRenew: false } : prev);
        setConfirmMsg(null);
        showToast("라이선스가 해지되었습니다.");
      },
    });
  };

  /* ── 행 클릭 → 상세 패널 ── */
  const openDetail = (lic) => {
    setSelLic(lic);
    setPanel("detail");
  };

  /* ── 추가 패널 오픈 ── */
  const openAdd = () => {
    setCodeInput(""); setCodePreview(null); setCodeError("");
    setPanel("add");
  };

  const ConfirmModal = ({ title, msg, onOk, onCancel }) => (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.45)", zIndex: 1200, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 12, padding: 28, width: 360, boxShadow: "0 8px 32px rgba(0,0,0,.2)" }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: "#ef4444" }}>{title}</div>
        <div style={{ fontSize: 13, color: C.txS, marginBottom: 24, lineHeight: 1.7 }}>{msg}</div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <Btn onClick={onCancel}>취소</Btn>
          <button onClick={onOk} style={{ padding: "7px 20px", fontSize: 13, fontWeight: 700, background: "#ef4444", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>확인</button>
        </div>
      </div>
    </div>
  );

  /* ── 상세 패널용 현재 라이선스 최신 상태 ── */
  const liveLic = selLic ? (licenses.find(l => l.id === selLic.id) || selLic) : null;
  const liveStatus = liveLic ? calcStatus(liveLic) : "";
  const col = liveLic ? (PLAN_COLOR[liveLic.type] || PLAN_COLOR.Standard) : {};
  const features = liveLic ? (PLAN_FEATURES[liveLic.planId] || []) : [];

  return (
    <div>
      <PH title="라이선스" bc="홈 > 라이선스 > 라이선스" />

      <div>
        <div>

          {/* sec-title */}
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", paddingTop: 38, paddingBottom: 8, borderBottom: `1px solid ${C.brdD}`, marginBottom: 0 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 600, color: C.txH }}>라이선스 목록</span>
              <span style={{ fontSize: 12, color: C.txL }}>{licenses.length}건</span>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <SecBtnP onClick={openAdd}>+ 라이선스 추가</SecBtnP>
            </div>
          </div>

          {/* 테이블 */}
          <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: "100%", width: "max-content", borderCollapse: "collapse", fontSize: 15, borderBottom: `1px solid ${C.brd}` }}>
            <thead>
              <tr style={{ borderTop: `1px solid ${C.txH}` }}>
                {[["상태", 100], ["라이선스 코드", 200], ["플랜", 110], ["결제 주기", 90], ["구독 시작일", 110], ["만료일", 110], ["자동갱신", 80], ["등록일", 100]].map(([h, w], i) => (
                  <th key={i} style={{ padding: "9px 12px", borderBottom: `1px solid ${C.brdD}`, textAlign: i === 1 ? "left" : "center", fontSize: 14, fontWeight: 400, color: C.txL, whiteSpace: "nowrap", verticalAlign: "middle", width: w }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {licenses.map(lic => {
                const st  = calcStatus(lic);
                const col = PLAN_COLOR[lic.type] || PLAN_COLOR.Standard;
                return (
                  <tr key={lic.id} onClick={() => openDetail(lic)}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={e => e.currentTarget.style.background = C.secL}
                    onMouseLeave={e => e.currentTarget.style.background = ""}>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle", width: 100 }}><StatusBadge status={st} /></td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "left", verticalAlign: "middle", minWidth: 200 }}>
                      <span style={{ fontFamily: "monospace", fontSize: 13, color: C.txt, fontWeight: 600 }}>{lic.code}</span>
                    </td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle" }}>
                      <span style={{ padding: "2px 9px", borderRadius: 5, fontSize: 11, fontWeight: 700, background: col.light, color: col.pri }}>{lic.planNm}</span>
                    </td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle", color: C.txt }}>{lic.cycle}</td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle", color: C.txt }}>{lic.startDt}</td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle", color: st === "만료" || st === "만료 예정" ? "#dc2626" : C.txt, fontWeight: st === "만료 예정" ? 600 : 400 }}>
                      {lic.endDt}
                    </td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle" }}>
                      <span style={{ fontSize: 11, color: lic.autoRenew ? "#16a34a" : C.txL }}>
                        {lic.autoRenew ? "사용" : "미사용"}
                      </span>
                    </td>
                    <td style={{ padding: "11px 12px", borderBottom: `1px solid ${C.brd}`, textAlign: "center", verticalAlign: "middle", color: C.txt }}>{lic.regDt}</td>
                  </tr>
                );
              })}
              {!licenses.length && (
                <tr><td colSpan={8} style={{ padding: 48, textAlign: "center", color: C.txL, fontSize: 13 }}>등록된 라이선스가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          사이드 패널: 라이선스 추가
      ══════════════════════════════════════ */}
      <SidePanel open={panel === "add"} onClose={() => setPanel(null)} title="라이선스 추가" width={500}>
        <SecTitle label="라이선스 코드 입력" primary />
        <div style={{ fontSize: 12, color: C.txS, marginBottom: 16, lineHeight: 1.7 }}>
          발급받은 라이선스 코드를 입력하고 [코드 확인] 버튼을 클릭하세요.<br />
          코드 확인 후 라이선스 정보를 검토하고 등록을 진행할 수 있습니다.
        </div>

        <FormRow label="라이선스 코드" required>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              value={codeInput}
              onChange={e => { setCodeInput(e.target.value.toUpperCase()); setCodeError(""); setCodePreview(null); }}
              placeholder="예) CS-STD-2026-CCDD"
              style={{ ...fInput, flex: 1, fontFamily: "monospace", fontSize: 13, letterSpacing: "0.03em" }}
              onKeyDown={e => e.key === "Enter" && handleCodeCheck()}
            />
            <button onClick={handleCodeCheck}
              style={{ padding: "0 16px", fontSize: 12, fontWeight: 600, background: C.pri, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}>
              코드 확인
            </button>
          </div>
          {codeError && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>{codeError}</div>}
        </FormRow>

        {/* 코드 검증 성공 → 미리보기 */}
        {codePreview && (() => {
          const preCol = PLAN_COLOR[codePreview.type] || PLAN_COLOR.Standard;
          const preFeatures = PLAN_FEATURES[codePreview.planId] || [];
          return (
            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: 12, color: "#16a34a", fontWeight: 600, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                <span>✓</span> 유효한 라이선스 코드입니다.
              </div>

              {/* 플랜 정보 카드 */}
              <div style={{ border: `2px solid ${preCol.pri}`, borderRadius: 10, overflow: "hidden", marginBottom: 4 }}>
                <div style={{ padding: "14px 18px", background: preCol.light, borderBottom: `1px solid ${preCol.pri}33` }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 16, fontWeight: 800, color: C.txt }}>{codePreview.planNm} 플랜</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: preCol.pri, background: "#fff", padding: "2px 8px", borderRadius: 5 }}>{codePreview.type}</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.txS, fontFamily: "monospace" }}>{codePreview.code}</div>
                </div>
                <div style={{ padding: "14px 18px" }}>
                  {[
                    ["구독 시작일", codePreview.startDt],
                    ["만료일",      codePreview.endDt],
                    ["결제 주기",   codePreview.cycle],
                    ["자동 갱신",   codePreview.autoRenew ? "사용" : "미사용"],
                  ].map(([label, val], i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #f3f4f6", fontSize: 12 }}>
                      <span style={{ color: C.txS }}>{label}</span>
                      <span style={{ color: C.txt, fontWeight: 500 }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ marginTop: 12 }}>
                    {preFeatures.map((f, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.txS, marginBottom: 5 }}>
                        <span style={{ color: preCol.pri }}>✓</span> {f}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        <PanelFooter
          onCancel={() => setPanel(null)}
          onSave={handleAddLicense}
          saveLabel="라이선스 등록"
        />
      </SidePanel>

      {/* ══════════════════════════════════════
          사이드 패널: 라이선스 상세 / 관리
      ══════════════════════════════════════ */}
      <SidePanel open={panel === "detail" && !!liveLic} onClose={() => setPanel(null)}
        title="라이선스 상세" width={500}>
        {liveLic && (() => {
          const isActive = liveStatus === "구독중" || liveStatus === "만료 예정";
          return (
            <>
              {/* 플랜 헤더 */}
              <div style={{ padding: "16px 18px", background: col.light, borderRadius: 10, marginBottom: 20, border: `1px solid ${col.pri}33` }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 700, color: col.pri, marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.05em" }}>{liveLic.type}</div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: C.txt }}>{liveLic.planNm} 플랜</div>
                  </div>
                  <StatusBadge status={liveStatus} />
                </div>
                <div style={{ fontSize: 12, color: C.txS, fontFamily: "monospace", marginBottom: 10 }}>{liveLic.code}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 0", fontSize: 12 }}>
                  {[
                    ["구독 시작일", liveLic.startDt],
                    ["만료일",     liveLic.endDt + (liveStatus === "만료 예정" ? "  ⚠" : "")],
                    ["결제 주기",  liveLic.cycle],
                    ["등록일",     liveLic.regDt],
                  ].map(([label, val], i) => (
                    <div key={i} style={{ paddingRight: 12 }}>
                      <div style={{ color: C.txL, fontSize: 11, marginBottom: 1 }}>{label}</div>
                      <div style={{ color: C.txt, fontWeight: 500 }}>{val}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 이용 내역 */}
              <SecTitle label="이용 내역" primary />
              <div style={{ background: "#f8fafc", borderRadius: 8, border: `1px solid ${C.brd}`, overflow: "hidden", marginBottom: 20 }}>
                {features.map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: i < features.length - 1 ? `1px solid ${C.brd}` : "none", fontSize: 12 }}>
                    <span style={{ color: col.pri, fontSize: 13, flexShrink: 0 }}>✓</span>
                    <span style={{ color: C.txt }}>{f}</span>
                    <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, color: "#16a34a", background: "#dcfce7", padding: "1px 7px", borderRadius: 5 }}>이용 가능</span>
                  </div>
                ))}
              </div>

              {/* 관리 설정 — 구독중/만료예정만 */}
              {isActive && (
                <>
                  <SecTitle label="구독 설정" primary />
                  <FormRow label="자동 갱신">
                    <div style={{ display: "flex", gap: 16 }}>
                      {[[true, "사용"], [false, "사용 안함"]].map(([v, l]) => (
                        <label key={l} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, cursor: "pointer" }}>
                          <input type="radio" checked={liveLic.autoRenew === v}
                            onChange={() => handleToggleAutoRenew(liveLic.id, v)} /> {l}
                        </label>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: C.txS, marginTop: 4 }}>자동 갱신 시 만료 전 자동으로 결제됩니다.</div>
                  </FormRow>
                </>
              )}

              <PanelFooter
                onCancel={() => setPanel(null)}
                onSave={() => setPanel(null)}
                saveLabel="확인"
                extraLeft={
                  isActive ? (
                    <button onClick={() => handleCancel(liveLic.id)}
                      style={{ padding: "7px 14px", fontSize: 12, fontWeight: 600, border: "1px solid #fca5a5", borderRadius: 6, background: "#fef2f2", color: "#ef4444", cursor: "pointer" }}>
                      라이선스 해지
                    </button>
                  ) : null
                }
              />
            </>
          );
        })()}
      </SidePanel>

      {confirmMsg && (
        <ConfirmModal title={confirmMsg.title} msg={confirmMsg.msg}
          onOk={confirmMsg.onOk} onCancel={() => setConfirmMsg(null)} />
      )}

      {toast && (
        <div style={{ position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)", background: "#333333", color: "#fff", padding: "12px 24px", borderRadius: 10, fontSize: 13, fontWeight: 500, zIndex: 2000, boxShadow: "0 4px 20px rgba(0,0,0,.2)" }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
};

/* ── Page Router ── */
const Page = ({ p, s, loginMsg, onSaveLoginMsg, nav, toast, setBannerPreview }) => {
  if (s === "m") {
    const map = { md: <MgrDash nav={nav} />, mr: <MgrRes toast={toast} />, mis: <MgrInspSt />, mic: <MgrInspSch />, mid: <MgrInspD />, mip: <MgrInspSp />, mih: <MgrHist />, mbn: <MgrNotice />, mbl: <MgrLibrary />, msu: <MgrUsers />, mst: <MgrCL />, msv: <MgrVC />, msk: <MgrCategory />, msh: <MgrHoliday />, msa: <MgrAlert />, msnb: <MgrBanner setBannerPreview={setBannerPreview} />, msc: <MgrCode />, mslm: <MgrLoginMsg loginMsg={loginMsg} onSave={onSaveLoginMsg} />, msl: <MgrLicense />, mla: <MgrAccessLog />, mlr: <MgrResourceLog />, mli: <MgrInspLog />, mlp: <MgrPermLog />, mle: <MgrErrorLog />, mssc: <MgrSysCode />, msag: <MgrAgentAuth />, msi: <MgrSysInfo />, msp: <MgrSysProfile /> };
    if (map[p]) return map[p];
    const labels = { msp: "시스템 프로필", msi: "시스템정보", mla: "접속로그", mlr: "자원로그", mli: "점검로그", mlp: "권한변경로그", mle: "에러로그", mssc: "시스템코드", msag: "AGENT 권한관리", msapi: "API 관리" };
    if (labels[p]) return <Placeholder title={labels[p]} bc={`홈 > 환경설정 > ${labels[p]}`} />;
    return <MgrDash />;
  }
  const sMap = { sd: <StlDash />, sll: <StlDaily />, ssl: <StlSpecial />, sbn: <MgrNotice readOnly />, sbl: <MgrLibrary readOnly /> };
  if (sMap[p]) return sMap[p];
  const sLabels = { sep: "일반설정", sel: "라이선스", sei: "시스템정보" };
  if (sLabels[p]) return <Placeholder title={sLabels[p]} bc={`홈 > ${sLabels[p]}`} />;
  return <StlDash />;
};

/* ── Login ── */
const Login = ({ onLogin, loginMsg }) => {
  const [uid, setUid] = useState("admin");
  const [pw, setPw] = useState("password");
  const [site, setSite] = useState("m");
  const t = { ...BASE, ...(THEME[site] || THEME.m) };
  const is = { width: "100%", padding: "11px 14px", border: `1px solid #EEEEEE`, borderRadius: 4, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10, color: "#333333", background: "#fff" };
  return (
    <div style={{ minHeight: "100vh", background: t.brandBg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: '"Pretendard Variable",Pretendard,-apple-system,BlinkMacSystemFont,sans-serif' }}>
      <div style={{ width: 420, background: "#fff", borderRadius: 12, padding: "44px 40px", boxShadow: "0 24px 64px rgba(0,0,0,.25)" }}>
        <div style={{ textAlign: "center", marginBottom: loginMsg ? 20 : 32 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: t.brand, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <span style={{ color: "#fff", fontSize: 24, fontWeight: 800 }}>C</span>
          </div>
          <h1 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>
            <span style={{ color: t.brand }}>COMPLY</span><span style={{ color: "#111" }}>SIGHT</span>
          </h1>
          <p style={{ margin: 0, fontSize: 12, color: "#929292" }}>정보시스템 자원 점검 관리 플랫폼</p>
        </div>
        <div style={{ marginBottom: 6 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#929292", display: "block", marginBottom: 5 }}>아이디</label>
          <input value={uid} onChange={e => setUid(e.target.value)} style={is} placeholder="아이디를 입력하세요" />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#929292", display: "block", marginBottom: 5 }}>비밀번호</label>
          <input type="password" value={pw} onChange={e => setPw(e.target.value)} style={is} placeholder="비밀번호를 입력하세요" />
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {[["m", "Manager", "관리자 사이트"], ["s", "Sentinel", "점검자 사이트"]].map(([k, l, d]) => (
            <div key={k} onClick={() => setSite(k)} style={{ flex: 1, padding: "10px 8px", borderRadius: 6, border: `2px solid ${site === k ? t.brand : "#EEEEEE"}`, textAlign: "center", cursor: "pointer", background: site === k ? t.priL : "#fff", transition: "all .3s" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: site === k ? t.brand : "#666666" }}>{l}</div>
              <div style={{ fontSize: 11, color: "#929292", marginTop: 2 }}>{d}</div>
            </div>
          ))}
        </div>
        <button onClick={() => onLogin(uid, site)} style={{ width: "100%", padding: "13px", background: t.brand, color: "#fff", border: "none", borderRadius: 4, fontSize: 15, fontWeight: 600, cursor: "pointer", transition: "all .3s" }}
          onMouseEnter={e => e.currentTarget.style.background = t.brandD} onMouseLeave={e => e.currentTarget.style.background = t.brand}>로그인</button>
        <div style={{ textAlign: "center", marginTop: 14 }}><span style={{ fontSize: 12, color: t.brand, cursor: "pointer" }}>비밀번호 재설정</span></div>
        {loginMsg && (
          <div style={{ marginTop: 20, padding: "12px 14px", background: t.priL, border: `1px solid ${t.pri}30`, borderRadius: 6, fontSize: 12, color: t.priD, lineHeight: 1.65, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            <div style={{ fontWeight: 700, marginBottom: 4, fontSize: 11, color: t.pri }}>📢 시스템 안내</div>
            {loginMsg}
          </div>
        )}
      </div>
    </div>
  );
};

/* ── App ── */
export default function App() {
  const [auth, setAuth] = useState({ ok: false, user: null, site: null });
  const [pg, setPg] = useState("");
  const [col, setCol] = useState(false);
  const [gToast, setGToast] = useState(null);
  const toast = useCallback((msg, ok=true) => { setGToast({msg, ok}); setTimeout(() => setGToast(null), 2800); }, []);
  const [showPwChange, setShowPwChange] = useState(false);
  const [pwForm, setPwForm] = useState({cur:"",next:"",confirm:""});
  const [pwErr, setPwErr] = useState("");
  const [loginMsg, setLoginMsg] = useState("본 시스템은 COMPLYSIGHT 정보시스템 자원 점검 관리 플랫폼입니다.\n무단 접근은 금지되어 있으며, 모든 접속 이력은 기록됩니다.");
  const DEFAULT_BANNER = { title: "2월 정기점검 안내", msg: "2026년 2월 25일(수) 02:00~06:00 서버 정기점검이 진행됩니다.", type: "기본", bg: "#F2F3F5", txt: "#333333", linkUrl: "/notice/1", closable: true };
  const [bannerPreview, setBannerPreview] = useState(DEFAULT_BANNER);
  const [bannerClosed, setBannerClosed] = useState(false);

  const login = useCallback((uid, site) => {
    const u = USERS.find(x => x.userId === uid);
    if (u) { setTheme(site); setAuth({ ok: true, user: u, site }); setPg(site === "m" ? "md" : "sd"); setBannerClosed(false); }
  }, []);
  const logout = useCallback(() => { setTheme("s"); setAuth({ ok: false, user: null, site: null }); setPg(""); }, []);
  const sw = useCallback(() => {
    const ns = auth.site === "m" ? "s" : "m";
    setTheme(ns); setAuth(p => ({ ...p, site: ns })); setPg(ns === "m" ? "md" : "sd"); setBannerClosed(false);
  }, [auth.site]);

    if (!auth.ok) return <Login onLogin={login} loginMsg={loginMsg} />;

  const bannerH = (bannerPreview && !bannerClosed) ? 40 : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: C.bg, fontFamily: '"Pretendard Variable",Pretendard,-apple-system,BlinkMacSystemFont,sans-serif' }}>
      {/* 공지배너 미리보기 - 헤더 위 */}
      {(bannerPreview && !bannerClosed) && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", zIndex: 300, background: bannerPreview.bg, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 20px", animation: "modalIn .15s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 }}>
            {bannerPreview.type !== "기본" && <span style={{ fontSize: 11, fontWeight: 800, background: "rgba(255,255,255,.22)", color: bannerPreview.txt, padding: "2px 8px", borderRadius: 3, whiteSpace: "nowrap" }}>{bannerPreview.type}</span>}
            <span style={{ fontSize: 13, fontWeight: 700, color: bannerPreview.txt, whiteSpace: "nowrap" }}>{bannerPreview.title || "배너 제목"}</span>
            <span style={{ fontSize: 12, color: bannerPreview.txt, opacity: .9, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{bannerPreview.msg || "배너 문구"}</span>
            {bannerPreview.linkUrl && <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4, background: bannerPreview.type === "기본" ? "rgba(0,0,0,.1)" : "rgba(255,255,255,.25)", color: bannerPreview.txt, whiteSpace: "nowrap", cursor: "pointer" }}>자세히 보기 →</span>}
          </div>
          {bannerPreview.closable && <span onClick={() => setBannerClosed(true)} style={{ fontSize: 18, color: bannerPreview.txt, opacity: .6, cursor: "pointer", marginLeft: 12, flexShrink: 0 }}>×</span>}
        </div>
      )}
      <Hdr user={auth.user} site={auth.site} sw={sw} logout={logout} siteName={auth.site === "m" ? "Manager" : "Sentinel"} onPwChange={() => { setPwForm({cur:"",next:"",confirm:""}); setPwErr(""); setShowPwChange(true); }} bannerH={bannerH} />
      <div style={{ display: "flex", flex: 1, minHeight: 0, background: C.bg, marginTop: 67 + bannerH }}>
        <Side menus={auth.site === "m" ? MM : SM} cur={pg} nav={setPg} site={auth.site} col={col} toggle={() => setCol(!col)} />
        {/* 메인 콘텐츠: 좌상단 radius 32px, 가이드 padding 38px 40px */}
        <main style={{ flex: 1, background: C.white, borderRadius: "20px 0 0 0", padding: "38px 40px 0 40px", overflowY: "auto", minWidth: 0, marginLeft: 30, scrollbarGutter: "stable" }}>
          <Page p={pg} s={auth.site} loginMsg={loginMsg} onSaveLoginMsg={setLoginMsg} nav={setPg} toast={toast} setBannerPreview={setBannerPreview} />
        </main>
      </div>
      {showPwChange && (
        <div style={{position:"fixed",top:0,left:0,width:"100%",height:"100%",background:"rgba(0,0,0,.35)",zIndex:9999,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={()=>setShowPwChange(false)}>
          <div style={{background:"#fff",borderRadius:10,padding:28,width:400,animation:"modalIn .2s ease"}} onClick={e=>e.stopPropagation()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <span style={{fontSize:18,fontWeight:700,color:C.txH}}>비밀번호 변경</span>
              <button onClick={()=>setShowPwChange(false)} style={{background:"none",border:"none",fontSize:22,cursor:"pointer",color:C.txL}}>×</button>
            </div>
            {[["현재 비밀번호","cur"],["새 비밀번호","next"],["새 비밀번호 확인","confirm"]].map(([label,key])=>(
              <div key={key} style={{marginBottom:14}}>
                <div style={{fontSize:13,fontWeight:600,color:C.txS,marginBottom:4}}>{label} <span style={{color:C.red}}>*</span></div>
                <input type="password" value={pwForm[key]} onChange={e=>setPwForm(p=>({...p,[key]:e.target.value}))} placeholder={label}
                  style={{width:"100%",padding:"8px 12px",border:`1px solid ${C.brd}`,borderRadius:4,fontSize:14,outline:"none",boxSizing:"border-box",fontFamily:"inherit"}} />
              </div>
            ))}
            {pwErr && <div style={{fontSize:12,color:C.red,marginBottom:8}}>{pwErr}</div>}
            <div style={{display:"flex",justifyContent:"flex-end",gap:8,paddingTop:12,borderTop:`1px solid ${C.brd}`}}>
              <Btn onClick={()=>setShowPwChange(false)}>취소</Btn>
              <Btn primary onClick={()=>{
                if(!pwForm.cur){setPwErr("현재 비밀번호를 입력하세요.");return;}
                if(!pwForm.next||pwForm.next.length<8){setPwErr("새 비밀번호는 8자 이상이어야 합니다.");return;}
                if(pwForm.next!==pwForm.confirm){setPwErr("새 비밀번호가 일치하지 않습니다.");return;}
                setShowPwChange(false);toast("비밀번호가 변경되었습니다.");
              }}>변경</Btn>
            </div>
          </div>
        </div>
      )}
      {gToast && (
        <div style={{position:"fixed",bottom:32,left:"50%",transform:"translateX(-50%)",zIndex:99999,padding:"12px 28px",borderRadius:8,fontSize:14,fontWeight:600,color:"#fff",background:gToast.ok?"#16a34a":"#dc2626",boxShadow:"0 4px 20px rgba(0,0,0,.18)",display:"flex",alignItems:"center",gap:8,animation:"toastIn .3s ease"}}>
          <span style={{fontSize:16}}>{gToast.ok?"✓":"✕"}</span>{gToast.msg}
        </div>
      )}
      <style>{"@keyframes subFadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}} @keyframes toastIn{from{opacity:0;transform:translateX(-50%) translateY(10px)}to{opacity:1;transform:translateX(-50%) translateY(0)}} @keyframes slideInLeft{from{opacity:0;transform:translateX(-20px)}to{opacity:1;transform:translateX(0)}}"}</style>
    </div>
  );
}
