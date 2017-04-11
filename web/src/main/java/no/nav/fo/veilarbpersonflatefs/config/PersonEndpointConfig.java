package no.nav.fo.veilarbpersonflatefs.config;

import no.nav.sbl.dialogarena.types.Pingable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;


@Configuration
public class PersonEndpointConfig {

    @Bean
    public Pingable portefoljePing() throws IOException {
        return () -> {
            try {
                HttpURLConnection connection = (HttpURLConnection) new URL(System.getProperty("veilarbperson.hent_person.url")).openConnection();
                connection.connect();
                if (connection.getResponseCode() == 200) {
                    return Pingable.Ping.lyktes("VeilArbPerson");
                }
                return Pingable.Ping.feilet("VeilArbPerson", new Exception("Statuskode: " + connection.getResponseCode()));
            } catch (Exception e) {
                return Pingable.Ping.feilet("VeilArbPerson", e);
            }
        };
    }
}
