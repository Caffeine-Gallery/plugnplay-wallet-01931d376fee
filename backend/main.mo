import Bool "mo:base/Bool";

import Principal "mo:base/Principal";
import Text "mo:base/Text";

actor {
    // Query call to check if a principal is authenticated
    public query func isAuthenticated(p : Principal) : async Bool {
        not Principal.isAnonymous(p);
    };

    // Get the caller's principal as text
    public shared(msg) func whoami() : async Text {
        Principal.toText(msg.caller);
    };
};
