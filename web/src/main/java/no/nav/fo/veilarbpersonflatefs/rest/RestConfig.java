package no.nav.fo.veilarbpersonflatefs.rest;

import org.glassfish.jersey.server.ResourceConfig;
import no.nav.brukerdialog.isso.RelyingPartyCallback;

public class RestConfig extends ResourceConfig{

    public RestConfig() {
        super(RelyingPartyCallback.class);
    }

}
