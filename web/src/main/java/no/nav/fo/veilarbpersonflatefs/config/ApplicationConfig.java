package no.nav.fo.veilarbpersonflatefs.config;

import no.nav.fo.veilarbpersonflatefs.internal.IsAliveServlet;
import org.springframework.context.annotation.*;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;

@Configuration
@Import({
        PersonEndpointConfig.class,
        VeilederEndpointConfig.class
})
public class ApplicationConfig {

    @Bean
    public static PropertySourcesPlaceholderConfigurer placeholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }


}