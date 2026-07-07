# 4-1 Mission

이 저장소는 웹 기초 과제를 단계적으로 완성하기 위한 작업 공간입니다.

## 개발 환경
- GitHub로 버전 관리
- Docker 기반 정적 서버
- 순수 HTML, CSS, JavaScript 중심 개발

## 실행 방법
```bash
docker compose up --build
```

기본 실행 주소:
- `http://localhost:8080`

## 작업 흐름
1. `phase/00_environment_and_repo_setup.md`에 따라 환경을 먼저 정리한다.
2. 이후 phase 문서를 순서대로 진행한다.
3. 각 단계가 끝날 때마다 Git 커밋을 남긴다.

## 현재 범위
이 프로젝트의 Docker는 복잡한 백엔드가 아니라,
정적 파일을 어디서든 같은 방식으로 열 수 있게 하는 최소 실행 환경이다.

## 참고
- `phase/00_phase_order.md`에서 전체 단계 순서를 확인할 수 있다.
- `phase/00_environment_and_repo_setup.md`에서 0단계의 완료 기준을 확인할 수 있다.
