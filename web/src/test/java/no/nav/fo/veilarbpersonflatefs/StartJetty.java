package no.nav.fo.veilarbpersonfs;

import no.nav.sbl.dialogarena.common.jetty.Jetty;

import static no.nav.sbl.dialogarena.common.jetty.Jetty.usingWar;
import static no.nav.sbl.dialogarena.common.jetty.JettyStarterUtils.*;

public class StartJetty {

    private static final int PORT = 8485;

    public static void main(String []args) {
        Jetty jetty = usingWar()
                .at("/veilarbpersonflatefs")
                .port(PORT)
                .loadProperties("/environment-test.properties")
                .buildJetty();
        jetty.startAnd(first(waitFor(gotKeypress())).then(jetty.stop));
    }

}
