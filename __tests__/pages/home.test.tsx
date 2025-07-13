describe('Utils Test', () => {
  it('should test string manipulation', () => {
    const str = 'South Pole';
    expect(str.toLowerCase()).toBe('south pole');
    expect(str.split(' ')).toEqual(['South', 'Pole']);
  });

  it('should test array operations', () => {
    const arr = [1, 2, 3];
    expect(arr.length).toBe(3);
    expect(arr.map(x => x * 2)).toEqual([2, 4, 6]);
  });
});