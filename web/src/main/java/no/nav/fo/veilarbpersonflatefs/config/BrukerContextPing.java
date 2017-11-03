package no.nav.fo.veilarbpersonflatefs.config;

import no.nav.sbl.dialogarena.types.Pingable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

@Configuration
public class BrukerContextPing {
    @Bean
    public Pingable modiacontextholderPing() throws IOException {
        return () -> {
            String url = System.getProperty("veiledercontext-isalive.url");
            Pingable.Ping.PingMetadata metadata = new Pingable.Ping.PingMetadata(url, "Holder status om enhet og bruker i context.", false);
            return ping(url, metadata);
        };
    }

    @Bean
    public Pingable modiaeventdistributionPing() throws IOException {
        return () -> {
            String url = System.getProperty("modiaeventdistribution-isalive.url");
            Pingable.Ping.PingMetadata metadata = new Pingable.Ping.PingMetadata(url, "Distribuerer events om endringer av bruker i context over websocket.", false);
            return ping(url, metadata);
        };
    }

    private Pingable.Ping ping(String url, Pingable.Ping.PingMetadata metadata) {
        try {
            HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
            connection.connect();
            if (connection.getResponseCode() == 200) {
                return Pingable.Ping.lyktes(metadata);
            }
            return Pingable.Ping.feilet(metadata, new Exception("Statuskode: " + connection.getResponseCode()));
        } catch (Exception e) {
            return Pingable.Ping.feilet(metadata, e);
        }
    }
}
