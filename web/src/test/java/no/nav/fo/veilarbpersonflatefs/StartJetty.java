package no.nav.fo.veilarbpersonflatefs;

import no.nav.brukerdialog.security.context.JettySubjectHandler;
import no.nav.sbl.dialogarena.common.jetty.Jetty;
import org.eclipse.jetty.client.HttpClient;
import org.eclipse.jetty.proxy.ProxyServlet;
import org.eclipse.jetty.server.handler.HandlerCollection;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.util.ssl.SslContextFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.http.HttpServletRequest;
import java.net.URI;
import java.util.Arrays;

import static java.lang.System.getProperty;
import no.nav.sbl.dialogarena.test.SystemProperties;
import org.apache.geronimo.components.jaspi.AuthConfigFactoryImpl;

import javax.security.auth.message.config.AuthConfigFactory;
import java.security.Security;

import static java.lang.System.setProperty;
import static no.nav.sbl.dialogarena.common.jetty.Jetty.usingWar;
import static no.nav.sbl.dialogarena.common.jetty.JettyStarterUtils.first;
import static no.nav.sbl.dialogarena.common.jetty.JettyStarterUtils.gotKeypress;
import static no.nav.sbl.dialogarena.common.jetty.JettyStarterUtils.waitFor;

public class StartJetty {

    private static final int PORT = 8880;

    public static void main(String []args) {
        SystemProperties.setFrom("environment-test.properties");

        setProperty("develop-local", "true");
        setProperty("no.nav.modig.core.context.subjectHandlerImplementationClass", JettySubjectHandler.class.getName());
        setProperty("org.apache.geronimo.jaspic.configurationFile", "web/src/test/resources/jaspiconf.xml");
        Security.setProperty(AuthConfigFactory.DEFAULT_FACTORY_SECURITY_PROPERTY, AuthConfigFactoryImpl.class.getCanonicalName());

        Jetty jetty = usingWar()
                .at("/veilarbpersonflatefs")
                .port(PORT)
                .loadProperties("/environment-test.properties")
                .overrideWebXml()
                .configureForJaspic()
                .buildJetty();

        addProxyContext(jetty);
        jetty.startAnd(first(waitFor(gotKeypress())).then(jetty.stop));
    }

    // TODO
    // Kopiert fra aktivitetsplan (http://stash.devillo.no/projects/FO/repos/aktivitetsplan/browse/web/src/test/java/no/nav/fo/aktivitetsplan/StartJetty.java)
    // Ta dette inn i common-jetty? Eller som egen modul?

    private static void addProxyContext(Jetty jetty) {
        String[] contekstNavn = {
            "internarbeidsflatedecorator",
            "veilarbpersonfs",
            "veilarbaktivitetsplanfs",
            "veilarbsituasjon",
            "veilarbperson",
            "veilarbveileder",
            "veilarbaktivitet"
        };

        HandlerCollection handler = new HandlerCollection();
        handler.addHandler(jetty.context);
        Arrays.stream(contekstNavn).map(StartJetty::proxyContext).forEach(handler::addHandler);
        jetty.server.setHandler(handler);
    }

    private static ServletContextHandler proxyContext(String proxyName) {
        ServletContextHandler servletContextHandler = new ServletContextHandler();
        servletContextHandler.addServlet(new ServletHolder(new ProxyProxyServlet(proxyName)), "/*");
        servletContextHandler.setContextPath("/" + proxyName);
        return servletContextHandler;
    }

    public static class ProxyProxyServlet extends ProxyServlet {

        private final Logger logger = LoggerFactory.getLogger(ProxyProxyServlet.class);
        private final String baseUrl;

        private ProxyProxyServlet(String proxyName) {
            this.baseUrl = getProperty(proxyName + ".url", getProperty(proxyName + ".default"));
            logger.info("proxy baseUrl: {} -> {}", proxyName, baseUrl);
        }

        @Override
        protected HttpClient newHttpClient() {
            SslContextFactory sslContextFactory = new SslContextFactory();
            sslContextFactory.setTrustAll(true);
            HttpClient httpClient = new HttpClient(sslContextFactory);
            httpClient.setFollowRedirects(false);
            return httpClient;
        }

        @Override
        protected URI rewriteURI(HttpServletRequest request) {
            StringBuffer uri = new StringBuffer(baseUrl);
            uri.append(request.getRequestURI());
            String query = request.getQueryString();
            if (query != null) {
                uri.append("?").append(query);
            }
            URI targetUri = URI.create(uri.toString());
            logger.info("proxy: {}", uri);
            return targetUri;
        }
    }
}
