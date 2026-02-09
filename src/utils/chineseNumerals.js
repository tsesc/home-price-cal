const digitMap = {
  '零': 0, '一': 1, '二': 2, '三': 3, '四': 4,
  '五': 5, '六': 6, '七': 7, '八': 8, '九': 9,
}

export const chineseToNumber = (str) => {
  if (!str || typeof str !== 'string') return 0

  const trimmed = str.trim().replace('層', '')
  if (!trimmed) return 0

  // 如果已經是阿拉伯數字
  const num = parseInt(trimmed, 10)
  if (!isNaN(num)) return num

  let result = 0
  let current = 0

  for (const char of trimmed) {
    if (char === '十') {
      if (current === 0) current = 1
      result += current * 10
      current = 0
    } else if (char === '百') {
      if (current === 0) current = 1
      result += current * 100
      current = 0
    } else if (digitMap[char] !== undefined) {
      current = digitMap[char]
    }
  }

  result += current
  return result
}
