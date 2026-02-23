// 模拟文档中的 H = Hash(Asset content ∥ Timestamp)
export const calculateAssetHash = async (file, timestamp) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      // 简化版：实际应使用SHA-256
      const hash = btoa(content.slice(0, 100) + timestamp).slice(0, 32);
      resolve(hash);
    };
    reader.readAsText(file.slice(0, 200)); // 只读取部分内容示例
  });
};