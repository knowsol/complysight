# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

COMPLYSIGHT - 정보시스템 자원 점검 관리 플랫폼 (IT Infrastructure Compliance & Inspection Management Platform).
Next.js (App Router) + React 기반 SPA로, 현재 `complysight-app-v6.jsx` 단일 파일(~9,900줄)에 모든 코드가 집약되어 있다.
이 프로젝트의 주요 작업은 **컴포넌트 분리 + CSS 분리**이다.

## Commands

```bash
npm run dev      # Next.js 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run start    # 프로덕션 서버
npm run lint     # ESLint 실행
```

## Source File Structure (현재 상태)

`complysight-app-v6.jsx` 단일 파일의 구조 (라인 기준):

| 영역 | 라인 범위 | 내용 |
|------|----------|------|
| Design Tokens | 1-37 | `BASE`, `THEME`, `sideTheme`, `SC` 컬러 시스템 |
| Mock Data | 39-180 | `USERS`, `SYS`, `RES`(262개 자동생성), `DI`, `SI`, `SCH`, `CL`, `VC`, `NT` |
| Icons | 182-206 | `Ic` SVG 아이콘 컴포넌트 (16종) |
| UI Primitives | 208-417 | `Badge`, `Btn`, `Card`, `Stat`, `PH`, `SB`, `Tbl`, `GuiPag`, `Modal`, `FormRow`, `SecTitle`, `PanelFooter` 등 |
| RoSelect / Helpers | 418-438 | `RoSelect`, `fInput`, `fSelect`, `fTextarea` 스타일 객체 |
| Domain Panels | 439-3037 | `AddSystemModal`, `SidePanel`, `ResourcePanel`, `DailyReportPanel`, `SpecialPanel`, `SchedulePanel`, `DailyRequestPanel`, `NoticePanel`, `SystemDetailPanel`, `ExcelUploadModal` |
| Layout | 1173-1504 | 메뉴 정의(`MM`, `SM`), `Side` 사이드바, `Hdr` 헤더 |
| Manager Pages | 3039-9169 | `MgrDash`, `MgrRes`, `MgrInspSt`, `MgrInspSch`, `MgrInspD`, `MgrInspSp`, `MgrHist`, `MgrNotice`, `MgrLibrary`, `MgrUsers`, `MgrCL`, `MgrVC`, `MgrCategory`, `MgrCode`, `MgrLoginMsg`, `MgrBanner`, `MgrAlert`, `MgrHoliday`, `MgrCommonCode`, `MgrResourceLog`, `MgrInspLog`, `MgrErrorLog`, `MgrAccessLog`, `MgrPermLog`, `MgrSysCode`, `MgrAgentAuth`, `MgrSysProfile`, `MgrSysInfo`, `MgrLicense` |
| Sentinel Pages | 4907-5008 | `StlDash`, `StlDaily`, `StlSpecial` |
| Settings Pages | 5009-9169 | `MgrCategory` ~ `MgrSysProfile` (환경설정 하위 페이지들) |
| Router | 9744-9757 | `Page` 컴포넌트 - 라우트 맵핑 |
| Login | 9760-9806 | `Login` 컴포넌트 |
| App Root | 9809-9895 | `App` - 인증, 레이아웃, 토스트, 배너 |

## Design System

### Theme Architecture

듀얼 테마: Manager(파란색 `m`)와 Sentinel(초록색 `s`).
전역 변수 `C`에 `BASE` + `THEME[site]`가 합쳐져 모든 컴포넌트가 `C.pri`, `C.sec`, `C.txt` 등으로 참조한다.
`setTheme(site)` 호출로 전환. 이 패턴은 CSS 변수(custom properties) 기반으로 전환해야 한다.

### Color Tokens

- **BASE** (공통): `white`, `bg`(#F9FAFC), `brd`(#EEEEEE), `brdD`(#D7D7D7), `txt`(#333), `txS`(#666), `txL`(#929292), `txX`(#BBB), `txH`(#111), `bgSec`(#E9ECF3), `red`(#E24949), `green`(#19973C)
- **Manager(m)**: `pri`(#339CD5), `sec`(#457CE1), `brand`(#005CB9)
- **Sentinel(s)**: `pri`(#19973C), `sec`(#19973C), `brand`(#15803D)
- **Status Chips(SC)**: 예정(회색), 진행(파랑), 지연(주황), 완료(초록)

### Font

`"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, sans-serif`

### Inline Style Objects

현재 모든 스타일이 인라인. 공통 스타일 객체: `fInput`, `fSelect`, `fTextarea`.

## Component Separation Rules

### Target Directory Structure

```
src/
├── styles/
│   ├── variables.css          # CSS custom properties (BASE, THEME 토큰)
│   ├── global.css             # 리셋, 폰트, 키프레임 애니메이션
│   └── components/            # 컴포넌트별 CSS 모듈
│       ├── Badge.module.css
│       ├── Button.module.css
│       ├── Card.module.css
│       ├── Table.module.css
│       ├── Modal.module.css
│       ├── SidePanel.module.css
│       ├── Sidebar.module.css
│       ├── Header.module.css
│       └── ...
├── data/
│   └── mock.js                # USERS, SYS, RES, DI, SI, SCH, CL, VC, NT 전체 mock 데이터
├── constants/
│   ├── theme.js               # BASE, THEME, sideTheme, SC, setTheme
│   └── menu.js                # MM, SM 메뉴 정의
├── hooks/
│   └── useEditPanel.js        # useEditPanel 커스텀 훅
├── components/
│   ├── common/                # 재사용 UI primitives
│   │   ├── Icon.jsx           # Ic
│   │   ├── Badge.jsx          # Badge, YnBadge, RoleBadge
│   │   ├── Button.jsx         # Btn, SecBtnO, SecBtnP
│   │   ├── Card.jsx           # Card, Stat
│   │   ├── Table.jsx          # Tbl, GuiPag
│   │   ├── Modal.jsx          # Modal
│   │   ├── SidePanel.jsx      # SidePanel
│   │   ├── FormRow.jsx        # FormRow, SecTitle, PanelDeleteBtn, PanelFooter
│   │   ├── SearchBar.jsx      # SB
│   │   ├── Select.jsx         # RoSelect
│   │   └── UnsavedConfirm.jsx # UnsavedConfirm
│   ├── layout/
│   │   ├── Sidebar.jsx        # Side
│   │   ├── Header.jsx         # Hdr
│   │   └── PageHeader.jsx     # PH
│   └── panels/                # 도메인 특화 패널
│       ├── ResourcePanel.jsx
│       ├── AddSystemModal.jsx
│       ├── DailyReportPanel.jsx
│       ├── SpecialPanel.jsx
│       ├── SchedulePanel.jsx
│       ├── DailyRequestPanel.jsx
│       ├── NoticePanel.jsx
│       ├── SystemDetailPanel.jsx
│       └── ExcelUploadModal.jsx
├── pages/
│   ├── manager/               # Mgr* 페이지 컴포넌트
│   │   ├── Dashboard.jsx      # MgrDash
│   │   ├── Resource.jsx       # MgrRes
│   │   ├── InspectionStatus.jsx
│   │   ├── InspectionSchedule.jsx
│   │   ├── DailyInspection.jsx
│   │   ├── SpecialInspection.jsx
│   │   ├── History.jsx
│   │   ├── Notice.jsx
│   │   ├── Library.jsx
│   │   ├── Users.jsx
│   │   ├── Checklist.jsx
│   │   ├── ValidationCode.jsx
│   │   ├── Category.jsx
│   │   ├── CommonCode.jsx
│   │   ├── LoginMessage.jsx
│   │   ├── Banner.jsx
│   │   ├── Alert.jsx
│   │   ├── Holiday.jsx
│   │   ├── logs/              # 로그 관련 페이지들
│   │   │   ├── AccessLog.jsx
│   │   │   ├── ResourceLog.jsx
│   │   │   ├── InspectionLog.jsx
│   │   │   ├── ErrorLog.jsx
│   │   │   └── PermissionLog.jsx
│   │   └── settings/          # 보안 및 개발
│   │       ├── SystemCode.jsx
│   │       ├── AgentAuth.jsx
│   │       ├── SystemProfile.jsx
│   │       ├── SystemInfo.jsx
│   │       └── License.jsx
│   └── sentinel/              # Stl* 페이지 컴포넌트
│       ├── Dashboard.jsx
│       ├── DailyInspection.jsx
│       └── SpecialInspection.jsx
├── router/
│   └── Page.jsx               # Page 라우트 맵핑
├── Login.jsx
└── App.jsx
```

### Naming Conventions

- **컴포넌트 파일**: PascalCase (e.g., `DailyReportPanel.jsx`)
- **CSS 모듈**: 컴포넌트명.module.css (e.g., `DailyReportPanel.module.css`)
- **약어 매핑**: 원본의 축약명을 분리 시 풀네임으로 변경
  - `PH` → `PageHeader`, `SB` → `SearchBar`, `Tbl` → `Table`
  - `Hdr` → `Header`, `Side` → `Sidebar`, `Ic` → `Icon`
  - `Mgr*` → `pages/manager/*`, `Stl*` → `pages/sentinel/*`
- **CSS 클래스**: camelCase (CSS Modules)
- **CSS 변수**: `--cs-` prefix (e.g., `--cs-pri`, `--cs-txt`, `--cs-brd`)

### CSS Separation Strategy

1. **CSS Custom Properties로 테마 전환**: `C.pri` 같은 JS 변수 대신 `var(--cs-pri)` 사용. `[data-theme="m"]`/`[data-theme="s"]` 속성으로 전환.
2. **CSS Modules 사용**: 컴포넌트별 `.module.css` 파일. 글로벌 스타일 오염 방지.
3. **인라인 스타일 → 클래스 전환 우선순위**:
   - 고정 레이아웃 스타일 → CSS 클래스로 추출
   - 동적 값(테마 컬러) → CSS 변수로 전환
   - 조건부 스타일(hover 등) → CSS 클래스 + pseudo-class
   - `onMouseEnter`/`onMouseLeave` JS hover → CSS `:hover`로 교체
4. **공통 스타일 객체** (`fInput`, `fSelect`, `fTextarea`) → `styles/form.css`로 추출
5. **키프레임 애니메이션** (`modalIn`, `toastIn`, `subFadeIn`, `slideInLeft`) → `global.css`로 이동

### Component Separation Priority

분리 순서 (의존성 기준):

1. `constants/` (theme, menu) + `data/mock.js` — 다른 모든 것의 기반
2. `styles/variables.css` + `global.css` — CSS 토큰 정의
3. `components/common/` — UI primitives (다른 컴포넌트들이 의존)
4. `hooks/` — 커스텀 훅
5. `components/layout/` — Sidebar, Header
6. `components/panels/` — 도메인 패널
7. `pages/` — 페이지 컴포넌트 (가장 많은 의존성)
8. `router/Page.jsx` + `Login.jsx` + `App.jsx` — 최상위

### Key Patterns to Preserve

- **전역 테마 객체 `C`**: 현재 mutable 전역 변수. CSS 변수로 전환하되, JS에서 접근해야 하는 곳은 `theme` context 또는 `useTheme` 훅 제공.
- **`setTheme(site)` 호출**: 로그인/사이트 전환 시 호출. CSS 변수 방식에서는 `document.documentElement.setAttribute('data-theme', site)`로 대체.
- **Tbl 컴포넌트**: 페이지네이션 내장. `pageSize`, `noPaging`, `secTitle`, `secButtons` props 유지.
- **SidePanel**: `width`, `open`, `onClose`, `title` 인터페이스 유지. 우측 슬라이드.
- **useEditPanel 훅**: `dirty` 상태 추적, `UnsavedConfirm` 모달 연동.
- **Page 라우터**: `pg` 문자열 키 → 컴포넌트 맵핑. 향후 React Router 전환 가능하나 현재는 이 패턴 유지.

## Routing

SPA 내부 라우팅은 `pg` state 문자열 기반. `Page` 컴포넌트가 site(`m`/`s`)와 pg 값으로 컴포넌트를 맵핑한다.

- **Manager 라우트 키**: `md`(대시보드), `mr`(자원관리), `mis`(점검현황), `mic`(정기점검), `mid`(일상점검), `mip`(특별점검), `mih`(점검이력), `mbn`(공지사항), `mbl`(자료실), `msu`(사용자), `mst`(점검표), `msv`(검증코드), `msk`(카테고리), `msc`(공통코드), `mslm`(로그인메시지), `msnb`(공지배너), `msa`(기본알림), `msh`(휴무일), `msl`(라이선스), `mla`(접속로그), `mlr`(자원로그), `mli`(점검로그), `mlp`(권한변경로그), `mle`(에러로그), `mssc`(시스템코드), `msag`(AGENT권한), `msp`(시스템프로필), `msi`(시스템정보)
- **Sentinel 라우트 키**: `sd`(대시보드), `sll`(일상점검), `ssl`(특별점검), `sbn`(공지사항), `sbl`(자료실), `sep`(일반설정), `sel`(라이선스), `sei`(시스템정보)

## Working Rules

- 모든 UI 텍스트는 한국어(Korean)로 유지
- Mock 데이터의 필드명은 축약형 유지 (`nm`, `st`, `dt` 등) — API 스펙과 동일
- React import: `useState`, `useCallback`, `useRef`, `useEffect` 만 사용 (외부 라이브러리 없음)
- 컴포넌트 분리 시 기존 props 인터페이스를 변경하지 않는다
- CSS 분리 시 시각적 결과물이 원본과 동일해야 한다 (pixel-perfect)
- Next.js App Router 사용: `src/app/` 디렉토리에 라우트, 클라이언트 컴포넌트는 `"use client"` 지시문 필수
- 원본 `complysight-app-v6.jsx`는 레퍼런스로 루트에 보존. 분리된 컴포넌트는 `src/` 하위에 위치
