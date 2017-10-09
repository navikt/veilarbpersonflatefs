package no.nav.fo.veilarbpersonflatefs;

import no.nav.dialogarena.config.DevelopmentSecurity;
import no.nav.sbl.dialogarena.common.jetty.Jetty;

import static no.nav.sbl.dialogarena.common.jetty.Jetty.usingWar;
import static no.nav.sbl.dialogarena.common.jetty.JettyStarterUtils.*;

public class StartJetty {

    private static final int PORT = 8485;

    public static void main(String []args) {
        Jetty jetty = DevelopmentSecurity.setupISSO(
                usingWar()
                        .at("/veilarbpersonflatefs")
                        .port(PORT)
                        .loadProperties("/environment-test.properties"),
                new DevelopmentSecurity.ISSOSecurityConfig("veilarbpersonflatefs")
        ).buildJetty();
        jetty.startAnd(first(waitFor(gotKeypress())).then(jetty.stop));
    }

}
