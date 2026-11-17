# 2027 대학입시 전략실 — iPhone PWA

## 배포 (GitHub Pages)
1. GitHub에서 공개 저장소를 새로 만듭니다.
2. 이 ZIP의 `admission-pwa` 폴더 **안에 있는 파일과 `icons` 폴더**를 저장소 최상위에 업로드합니다.
3. 저장소 Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save.
4. 몇 분 뒤 제공되는 `https://사용자명.github.io/저장소명/` 주소를 iPhone Safari로 엽니다.
5. Safari 공유 → 홈 화면에 추가 → 추가.

## 주의
- ZIP이나 `file://`에서 직접 열면 서비스워커가 작동하지 않습니다. HTTPS 배포가 필요합니다.
- 입시 자료는 사용자 입력 기반이며 실제 합격 확률 계산이나 공식 자료 자동 동기화는 없습니다.
- 데이터는 브라우저 localStorage에만 저장됩니다. 정기적으로 설정·백업 탭에서 JSON 백업을 다운로드하세요.
- 공개 GitHub 저장소에는 성적/개인정보/백업 JSON을 올리지 마세요. 소스코드만 배포하세요.
- 다른 기기에서 사용하려면 백업 파일을 직접 복원해야 합니다.
- 실제 논술 날짜와 최저 기준은 반드시 대학 입학처 공지로 확인하세요.
