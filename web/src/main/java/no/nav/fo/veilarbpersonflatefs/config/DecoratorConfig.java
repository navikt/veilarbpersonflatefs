package no.nav.fo.veilarbpersonflatefs.config;

import no.nav.innholdshenter.common.ContentRetriever;
import no.nav.innholdshenter.filter.DecoratorFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.stream.Collectors;

import static java.lang.String.format;
import static java.util.Arrays.asList;

@Configuration
public class DecoratorConfig {
    @Value("${iadecorator.url}")
    private String decoratorJS;


    @Bean
    public DecoratorFilter decoratorFilter() {
        Map<String, String> fragmenter = new HashMap<>();
        fragmenter.put("versjonsnummer", System.getProperty("application.version"));

        DecoratorFilter filter = new DecoratorFilter();
        filter.setFragmentsUrl("");
        filter.setNoDecoratePatterns(new ArrayList<>(asList(".*/img/.*", ".*/internal/.*")));
        filter.setApplicationName("veilarbportefoljeflatefs");
        filter.setFragmentNames(asList("decoratorscript", "timestamp", "versjonsnummer"));
        filter.setContentRetriever(contentRetriever(fragmenter));
        return filter;
    }

    ContentRetriever contentRetriever(Map<String, String> fragments) {
        final String staticHtml = createHtml(fragments);

        return new ContentRetriever() {
            @Override
            public String getPageContent(String path) {
                return content();
            }

            @Override
            public String getPageContentFullUrl(String url) {
                return content();
            }

            private String content() {
                return "<div>" + staticHtml + createDynamicHtml() + "</div>";
            }

            private String createDynamicHtml() {
                return keyValueAsDiv("timestamp", Long.toString(System.currentTimeMillis()))
                        + keyValueAsDiv("decoratorscript", decoratorScript());
            }

            @Override
            public Properties getProperties(String path) {
                return new Properties();
            }

            @Override
            public Properties getPropertiesFullUrl(String url) {
                return new Properties();
            }

            @Override
            public void setBaseUrl(String baseUrl) {

            }
        };
    }

    private String decoratorScript() {
        return format("<script type=\"text/javascript\" charset=\"UTF-8\" src=\"%s\"></script>",
                decoratorJS + "?v=" + Long.toString(System.currentTimeMillis())
        );
    }

    private static String createHtml(Map<String, String> fragments) {
        return fragments
                .entrySet()
                .stream()
                .map((entry) -> keyValueAsDiv(entry.getKey(), entry.getValue()))
                .collect(Collectors.joining("\n"));
    }

    private static String keyValueAsDiv(String key, String value) {
        return format("<div id=\"%s\">%s</div>", key, value);
    }

}
