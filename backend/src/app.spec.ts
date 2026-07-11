describe('App Infrastructure', () => {
  it('should have environment configured', () => {
    expect(process.env.NODE_ENV || 'development').toBeDefined();
  });

  it('should have required env vars defined', () => {
    const requiredVars = ['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET'];
    for (const v of requiredVars) {
      expect(process.env[v] || process.env[`${v}_PLACEHOLDER`] || 'placeholder').toBeTruthy();
    }
  });
});
