package no.nav.fo.veilarbpersonflatefs.config;

import no.nav.sbl.dialogarena.types.Pingable;
import no.nav.sbl.dialogarena.types.Pingable.Ping.PingMetadata;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;


@Configuration
public class PersonEndpointConfig {

    @Bean
    public Pingable portefoljePing() throws IOException {
        PingMetadata metadata = new PingMetadata(
                "VeilArbPerson via " + System.getProperty("veilarbperson.hent_person.url"),
                "Endepunkt for å hente informasjon om en person.",
                true
        );

        return () -> {
            try {
                HttpURLConnection connection = (HttpURLConnection) new URL(System.getProperty("veilarbperson.hent_person.url")).openConnection();
                connection.connect();
                if (connection.getResponseCode() == 200) {
                    return Pingable.Ping.lyktes(metadata);
                }
                return Pingable.Ping.feilet(metadata, "Fikk uforventet statuskode: " + connection.getResponseCode());
            } catch (Exception e) {
                return Pingable.Ping.feilet(metadata, e);
            }
        };
    }
}
