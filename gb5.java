package pucrs.myflight.modelo;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public class App {

    private static final String AIRLINES_FILE = "airlines.dat";
    private static final String AIRCRAFTS_FILE = "aircrafts.dat";
    private static final String AIRPORTS_FILE = "airports.dat";
    private static final String ROUTES_FILE = "routes.dat";


    public static void main(String[] args) {

        GerenciadorCias gerCias = loadCias();
        GerenciadorAeronaves gerAvioes = loadAeronaves();
        GerenciadorAeroportos gerAero = loadAeroportos();
        GerenciadorRotas gerRotas = loadRotas(gerCias, gerAero, gerAvioes);
        GerenciadorVoos gerVoos = createVoos(gerCias, gerAvioes, gerAero, gerRotas);

        System.out.println("Todos os vôos:\n");
        for (Voo v : gerVoos.listarTodos()) {
            if (v instanceof VooEscalas) {
                System.out.println(">>> Vôo com escalas!");
                VooEscalas vaux = (VooEscalas) v;
                System.out.println("Escalas: " + vaux.getTotalRotas());
            }
            System.out.println(v);
        }

        System.out.println("\nVôos cuja origem é Guarulhos (gru)\n");
        for (Voo v : gerVoos.buscarOrigem("GRU"))
            System.out.println(v);


        printAirportLocationsByTime(gerVoos, LocalTime.of(8, 0), LocalTime.of(9, 0));

        printAirportLocationsByTime(gerVoos, LocalTime.of(9, 0), LocalTime.of(16, 0));


        printAirportsAndRoutesForAirline(gerRotas, gerAero, "3J");
    }

    private static GerenciadorCias loadCias() {
        GerenciadorCias gerCias = new GerenciadorCias();
        try {
            gerCias.carregaDadosCias();
        } catch (IOException e) {
            System.out.println("Não foi possível ler " + AIRLINES_FILE + "!");
        }
        return gerCias;
    }

    private static GerenciadorAeronaves loadAeronaves() {
        GerenciadorAeronaves gerAvioes = new GerenciadorAeronaves();
        try {
            gerAvioes.carregaDadosAvioes();
        } catch (IOException e) {
            System.out.println("Não foi possível ler " + AIRCRAFTS_FILE + "!");
        }
        return gerAvioes;
    }

    private static GerenciadorAeroportos loadAeroportos() {
        GerenciadorAeroportos gerAero = new GerenciadorAeroportos();
        try {
            gerAero.carregaDadosAeroporto();
        } catch (IOException e) {
            System.out.println("Não foi possível ler " + AIRPORTS_FILE + "!");
        }
        return gerAero;
    }

    private static GerenciadorRotas loadRotas(GerenciadorCias gerCias, GerenciadorAeroportos gerAero, GerenciadorAeronaves gerAvioes) {
        GerenciadorRotas gerRotas = new GerenciadorRotas();
        try {
            gerRotas.carregaDadosRotas(gerCias, gerAero, gerAvioes);
        } catch (IOException e) {
            System.out.println("Não foi possível ler " + ROUTES_FILE + "!");
        }
        return gerRotas;
    }


    private static GerenciadorVoos createVoos(GerenciadorCias gerCias, GerenciadorAeronaves gerAvioes, GerenciadorAeroportos gerAero, GerenciadorRotas gerRotas) {
        CiaAerea latam = gerCias.buscarCodigo("JJ");
        CiaAerea tap = gerCias.buscarCodigo("TP");

        Aeronave b733 = gerAvioes.buscarCodigo("733");
        Aeronave a380 = gerAvioes.buscarCodigo("380");

        Aeroporto poa = gerAero.buscarCodigo("POA");
        Aeroporto gru = gerAero.buscarCodigo("GRU");
        Aeroporto lis = gerAero.buscarCodigo("LIS");
        Aeroporto mia = gerAero.buscarCodigo("MIA");

        Rota poagru = new Rota(latam, poa, gru, b733);
        Rota grupoa = new Rota(latam, gru, poa, b733);
        Rota grumia = new Rota(tap, gru, mia, a380);
        Rota grulis = new Rota(tap, gru, lis, a380);

        LocalDateTime manhacedo = LocalDateTime.of(2018, 3, 29, 8, 0);
        LocalDateTime manhameio = LocalDateTime.of(2018, 4, 4, 10, 0);
        LocalDateTime tardecedo = LocalDateTime.of(2018, 4, 4, 14, 30);
        LocalDateTime tardetarde = LocalDateTime.of(2018, 4, 5, 17, 30);

        Duration curto = Duration.ofMinutes(90);
        Duration longo1 = Duration.ofHours(12);
        Duration longo2 = Duration.ofHours(14);

        GerenciadorVoos gerVoos = new GerenciadorVoos();

        gerVoos.adicionar(new Voo(poagru, curto));
        gerVoos.adicionar(new Voo(grulis, tardecedo, longo2));
        gerVoos.adicionar(new Voo(grulis, tardetarde, longo2));
        gerVoos.adicionar(new Voo(poagru, manhacedo, curto));
        gerVoos.adicionar(new Voo(grupoa, manhameio, curto));
        gerVoos.adicionar(new Voo(grumia, manhacedo, longo1));

        VooEscalas vooEsc = new VooEscalas(poagru, manhacedo, longo2);
        vooEsc.adicionarRota(grulis);
        gerVoos.adicionar(vooEsc);

        gerVoos.ordenarDataHoraDuracao();

        return gerVoos;
    }


    private static void printAirportLocationsByTime(GerenciadorVoos gerVoos, LocalTime inicio, LocalTime fim) {
        System.out.println("\nVôos que ocorrem entre " + inicio + " e " + fim + "\n");
        for (Voo v : gerVoos.buscarPeriodo(inicio, fim)) {
            Aeroporto origem = v.getRota().getOrigem();
            System.out.println(origem.getNome() + ": " + origem.getLocal());
        }
    }


    private static void printAirportsAndRoutesForAirline(GerenciadorRotas gerRotas, GerenciadorAeroportos gerAero, String airlineCode) {
        List<Aeroporto> aeroportos = new ArrayList<>();
        for (Rota r : gerRotas.listarTodas()) {
            if (r.getCia().getCodigo().equals(airlineCode)) {
                addUniqueAirport(aeroportos, r.getOrigem());
                addUniqueAirport(aeroportos, r.getDestino());
            }
        }
        System.out.println("Aeroportos servidos por " + airlineCode + " (" + aeroportos.size() + ")");
    }


    private static void addUniqueAirport(GerenciadorRotas gerRotas, String airlineCode) {
    Set<Aeroporto> airports = new HashSet<>();
    for (Rota r : gerRotas.listarTodas()) {
        if (r.getCia().getCodigo().equals(airlineCode)) {
            airports.add(r.getOrigem());
            airports.add(r.getDestino());
        }
    }
    System.out.println("\nAirports served by " + airlineCode + ": " + airports.size());
}

}
