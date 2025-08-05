# Calculator App

React + TypeScript + Vite + Tailwind CSS로 만든 계산기 애플리케이션입니다.

## 기술 스택

- **React 19** - 사용자 인터페이스 라이브러리
- **TypeScript** - 타입 안전성
- **Vite** - 빠른 개발 서버 및 빌드 도구
- **Tailwind CSS v4** - 유틸리티 우선 CSS 프레임워크
- **Lucide React** - 아이콘 라이브러리

## 개발 환경 설정

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

## 배포

이 프로젝트는 GitHub Pages를 통해 자동 배포됩니다.

### GitHub Actions를 통한 자동 배포

1. GitHub 저장소에 코드를 푸시하면 자동으로 배포됩니다
2. `main` 브랜치에 푸시할 때마다 GitHub Actions가 실행됩니다
3. 배포된 사이트는 `https://[username].github.io/caculator/`에서 확인할 수 있습니다

### 수동 배포

```bash
npm run deploy
```

## 프로젝트 구조

```
caculator/
├── src/
│   ├── App.tsx          # 메인 애플리케이션 컴포넌트
│   ├── main.tsx         # 애플리케이션 진입점
│   └── index.css        # Tailwind CSS 스타일
├── public/              # 정적 파일
├── .github/workflows/   # GitHub Actions 워크플로우
└── vite.config.ts       # Vite 설정
```
