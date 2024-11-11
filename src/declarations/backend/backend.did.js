export const idlFactory = ({ IDL }) => {
  return IDL.Service({
    'isAuthenticated' : IDL.Func([IDL.Principal], [IDL.Bool], ['query']),
    'whoami' : IDL.Func([], [IDL.Text], []),
  });
};
export const init = ({ IDL }) => { return []; };
