# Moon's Portfolio

Codyssey 4-1 미션으로 만든 정적 포트폴리오 웹사이트입니다.  
순수 `HTML`, `CSS`, `JavaScript`로 제작했고, GitHub API를 사용해 공개 저장소를 프로젝트 섹션에 불러옵니다.

## Live Demo
- 배포 URL: `https://wattamelon.github.io/portfolio/`
- 현재 반영 확인용 버전 배지: 화면 오른쪽 아래 `Build v0.6.3`

## 주요 기능
- 시맨틱 HTML 기반의 단일 페이지 포트폴리오
- 반응형 레이아웃
- 모바일 메뉴, 테마 전환, 상단 이동 버튼
- GitHub API 기반 프로젝트 카드 렌더링
- Contact 폼 유효성 검사
- 영어 단일 포트폴리오 콘텐츠
- 키보드 접근성을 위한 skip link, focus-visible, 상태 메시지 보강

## 사용 기술
- HTML5
- CSS3
- Vanilla JavaScript
- GitHub Pages
- GitHub REST API

## 실행 방법
```bash
# 가장 간단한 방법
index.html 파일을 브라우저에서 직접 열기
```

또는 정적 서버로 실행할 수 있습니다.

```bash
python3 -m http.server
```

## 프로젝트 구조
```txt
/
  index.html
  css/
    style.css
  js/
    main.js
  images/
  README.md
```

- `index.html`: 전체 페이지 구조와 접근성 마크업
- `css/style.css`: 레이아웃, 반응형 스타일, 상태 UI
- `js/main.js`: 메뉴, 테마, GitHub API, 폼 검증 로직
- `images/`: 프로필 이미지 등 정적 자산

## 접근성 및 배포 체크
- `alt`, `label`, `aria-live`, `aria-label` 적용
- 키보드 탭 이동과 skip link 지원
- 잘못된 폼 입력 시 필드별 에러 메시지 제공
- GitHub Pages 배포 경로를 고려한 상대 경로 사용
- 정적 자원에 버전 쿼리를 붙여 캐시 문제를 줄임

## 스크린샷
- 최종 제출용 캡처는 배포 화면 기준으로 추가 예정

## 참고
- phase 문서는 로컬 학습용 진행 문서로 관리합니다.
