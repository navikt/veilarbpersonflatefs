
export const isAppMocked = (): boolean => {
    // @ts-ignore
    return process.env.REACT_APP_MOCK === 'true';
};
