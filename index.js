import { readFileSync, writeFileSync } from "node:fs";
import Parser from "rss-parser";

// 기존 README.md 파일 읽기
const readmePath = "README.md";
let readmeContent = readFileSync(readmePath, "utf8");

// RSS 파서 생성
const parser = new Parser({
  headers: {
    Accept: "application/rss+xml, application/xml, text/xml; q=0.1",
  },
});

// 최신 블로그 포스트와 인사말 추가하는 함수
(async () => {
  // RSS 피드 가져오기
  const feed = await parser.parseURL("https://spacefriend.tistory.com/rss");

  // 맨 위에 추가할 인사말과 구분선
  const greeting = "# Hi, I'm banda 👋\n---\n\n";

  // 인사말이 이미 포함되어 있는지 확인 후 추가
  if (!readmeContent.startsWith(greeting)) {
    readmeContent = greeting + readmeContent;
  }

  // 최신 5개의 글의 제목과 링크를 추가할 텍스트 생성 (구분선 포함)
  let latestPosts = "### 😽🔐 Latest Blog Posts\n---\n\n";
  for (let i = 0; i < 5 && i < feed.items.length; i++) {
    const { title, link } = feed.items[i];
    latestPosts += `- [${title}](${link})\n`;
  }

  // 기존 "Latest Blog Posts" 섹션 대체
  const regex = /### 😽🔐 Latest Blog Posts\n---\n\n[\s\S]*?(?=\n\n## |\n$|$)/;
  if (regex.test(readmeContent)) {
    // 기존 섹션이 있으면 대체
    readmeContent = readmeContent.replace(regex, latestPosts);
  } else {
    // 기존 섹션이 없으면 새로 추가
    readmeContent += "\n\n" + latestPosts;
  }

  // 변경된 내용 저장
  writeFileSync(readmePath, readmeContent, "utf8");
  console.log("README.md 업데이트 완료");
})();

