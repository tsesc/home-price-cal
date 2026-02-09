import { describe, it, expect } from 'vitest'
import { chineseToNumber } from './chineseNumerals'

describe('chineseToNumber - 中文數字轉阿拉伯數字', () => {
  it('應轉換個位數', () => {
    expect(chineseToNumber('四')).toBe(4)
    expect(chineseToNumber('一')).toBe(1)
    expect(chineseToNumber('九')).toBe(9)
  })

  it('應轉換十位數', () => {
    expect(chineseToNumber('十')).toBe(10)
    expect(chineseToNumber('十一')).toBe(11)
    expect(chineseToNumber('十四')).toBe(14)
    expect(chineseToNumber('十九')).toBe(19)
  })

  it('應轉換二十以上', () => {
    expect(chineseToNumber('二十')).toBe(20)
    expect(chineseToNumber('二十五')).toBe(25)
    expect(chineseToNumber('三十')).toBe(30)
    expect(chineseToNumber('三十二')).toBe(32)
  })

  it('應處理帶「層」字的字串', () => {
    expect(chineseToNumber('四層')).toBe(4)
    expect(chineseToNumber('十四層')).toBe(14)
    expect(chineseToNumber('二十五層')).toBe(25)
  })

  it('應處理阿拉伯數字輸入', () => {
    expect(chineseToNumber('4')).toBe(4)
    expect(chineseToNumber('14')).toBe(14)
  })

  it('應處理空值和無效輸入', () => {
    expect(chineseToNumber('')).toBe(0)
    expect(chineseToNumber(null)).toBe(0)
    expect(chineseToNumber(undefined)).toBe(0)
  })
})
