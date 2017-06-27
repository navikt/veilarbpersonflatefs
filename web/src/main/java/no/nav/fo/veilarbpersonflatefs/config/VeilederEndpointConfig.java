package no.nav.fo.veilarbpersonflatefs.config;

import no.nav.sbl.dialogarena.types.Pingable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

@Configuration
public class VeilederEndpointConfig {

    @Bean
    public Pingable veilederPing() throws IOException {
        Pingable.Ping.PingMetadata metadata = new Pingable.Ping.PingMetadata(
                "VeilArbVeileder via " + System.getProperty("veilarbveileder.hent_enheter.url"),
                "Endepunkt for å hente enheter for en veileder.",
                true
        );

        return () -> {
            try {
                HttpURLConnection connection = (HttpURLConnection) new URL(System.getProperty("veilarbveileder.hent_enheter.url")).openConnection();
                connection.connect();
                if (connection.getResponseCode() == 200) {
                    return Pingable.Ping.lyktes(metadata);
                }
                return Pingable.Ping.feilet(metadata, "Returnerte uforventet statuskode: " + connection.getResponseCode());
            } catch (Exception e) {
                return Pingable.Ping.feilet(metadata, e);
            }
        };
    }


}
